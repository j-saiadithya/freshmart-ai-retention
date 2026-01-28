"""
Campaign management service
"""
import pandas as pd
import json
from typing import Dict, List
from pathlib import Path
import logging

from src.utils.config import settings                          # ✅ FIXED
from src.core.data_processing.data_loader import DataLoader    # ✅ FIXED
from src.core.ai_messaging.ai_generator import AIMessageGenerator  # ✅ FIXED
from src.core.communication.sms_service import sms_service     # ✅ FIXED

logger = logging.getLogger(__name__)


class CampaignService:
    def __init__(self):
        self.data_loader = DataLoader()
        self.ai_generator = AIMessageGenerator()
        self.sms_service = sms_service

        # Outputs directory
        self.outputs_dir = settings.outputs_dir
        self.outputs_dir.mkdir(parents=True, exist_ok=True)

    def prepare_campaign(
        self,
        customer_limit: int = 10,
        churn_risk: str = "High",
    ) -> List[Dict]:
        """
        Prepare campaign data for specified customers
        """
        try:
            data = self.data_loader.load_all_data()
            customers_df = data["customers"]
            transactions_df = data["transactions"]

            # Filter customers with phone numbers
            if "churn_risk" in customers_df.columns and churn_risk:
                filtered = customers_df[
                    customers_df["phone"].notna()
                    & (customers_df["churn_risk"] == churn_risk)
                ]
            else:
                filtered = customers_df[customers_df["phone"].notna()]

            target_customers = filtered.head(customer_limit)

            if target_customers.empty:
                logger.warning("No customers found for campaign")
                return []

            logger.info(f"Preparing campaign for {len(target_customers)} customers")

            campaign_data: List[Dict] = []

            for _, customer in target_customers.iterrows():
                customer_info = self._prepare_customer_info(
                    customer, transactions_df
                )

                # AI message (fallback guaranteed)
                message = self.ai_generator.generate_retention_message(customer_info)
                if not message:
                    message = self.ai_generator.generate_fallback_message(customer_info)

                campaign_data.append(
                    {
                        "customer_id": customer["customer_id"],
                        "name": f"{customer.get('first_name', '')} {customer.get('last_name', '')}".strip(),
                        "phone": customer["phone"],
                        "email": customer.get("email", ""),
                        "churn_risk": customer.get("churn_risk", "High"),
                        "message": message,
                        "offer_code": self._generate_offer_code(customer["customer_id"]),
                        "days_since": customer_info["days_since"],
                    }
                )

            self._save_campaign_data(campaign_data)
            return campaign_data

        except Exception as e:
            logger.error(f"Error preparing campaign: {e}")
            return []

    def execute_campaign(self, campaign_data: List[Dict]) -> Dict:
        """
        Execute SMS campaign
        """
        if not campaign_data:
            return {
                "success": False,
                "error": "No campaign data",
                "total": 0,
                "successful": 0,
                "failed": 0,
            }

        try:
            logger.info(f"Executing campaign for {len(campaign_data)} customers")

            sms_results = self.sms_service.send_batch_sms(campaign_data)

            successful = sum(1 for r in sms_results if r.get("success"))
            failed = len(sms_results) - successful

            results_data = self._prepare_results_data(
                campaign_data, sms_results
            )
            self._save_campaign_results(results_data)

            return {
                "success": True,
                "total": len(campaign_data),
                "successful": successful,
                "failed": failed,
                "results_file": str(self.outputs_dir / "campaign_results.csv"),
            }

        except Exception as e:
            logger.error(f"Error executing campaign: {e}")
            return {
                "success": False,
                "error": str(e),
                "total": 0,
                "successful": 0,
                "failed": 0,
            }

    def _prepare_customer_info(
        self, customer: pd.Series, transactions_df: pd.DataFrame
    ) -> Dict:
        """
        Prepare customer information for AI
        """
        customer_id = customer["customer_id"]
        cust_txn = transactions_df[
            transactions_df["customer_id"] == customer_id
        ]

        if not cust_txn.empty and "date" in cust_txn.columns:
            last_purchase_date = cust_txn["date"].max()
            days_since = (pd.Timestamp.now() - last_purchase_date).days
            last_product = cust_txn.iloc[-1].get("product_id", "groceries")
        else:
            days_since = 60
            last_product = "groceries"

        return {
            "name": f"{customer.get('first_name', '')} {customer.get('last_name', '')}".strip(),
            "days_since": int(days_since),
            "last_purchase": last_product,
            "favorite_category": customer.get(
                "favorite_category", "items you love"
            ),
        }

    def _generate_offer_code(self, customer_id: str) -> str:
        """
        Generate unique offer code
        """
        suffix = customer_id[-4:] if len(customer_id) >= 4 else "1234"
        return f"FRESH{suffix}"

    def _save_campaign_data(self, campaign_data: List[Dict]):
        file_path = self.outputs_dir / "campaign_data.json"
        with open(file_path, "w") as f:
            json.dump(campaign_data, f, indent=2)
        logger.info(f"Campaign data saved to {file_path}")

    def _save_campaign_results(self, results_data: List[Dict]):
        file_path = self.outputs_dir / "campaign_results.csv"
        pd.DataFrame(results_data).to_csv(file_path, index=False)
        logger.info(f"Campaign results saved to {file_path}")

    def _prepare_results_data(
        self,
        campaign_data: List[Dict],
        sms_results: List[Dict],
    ) -> List[Dict]:
        results = []

        for idx, (customer, sms) in enumerate(
            zip(campaign_data, sms_results), start=1
        ):
            results.append(
                {
                    "campaign_id": idx,
                    "customer_id": customer["customer_id"],
                    "customer_name": customer["name"],
                    "phone": customer["phone"],
                    "churn_risk": customer["churn_risk"],
                    "message_sent": customer["message"][:100],
                    "offer_code": customer["offer_code"],
                    "sms_success": sms.get("success", False),
                    "message_sid": sms.get("message_sid", ""),
                    "error": sms.get("error", ""),
                    "timestamp": pd.Timestamp.now().isoformat(),
                }
            )

        return results

    def get_campaign_status(self) -> Dict:
        """
        Service health check
        """
        return {
            "sms_service": "Ready"
            if self.sms_service.is_configured()
            else "Not configured",
            "ai_service": "Ready"
            if self.ai_generator.api_token
            else "Not configured",
            "outputs_dir": str(self.outputs_dir),
        }
