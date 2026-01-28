"""
Campaigns API endpoints
"""
from fastapi import APIRouter, HTTPException
from typing import Optional
import logging
from pathlib import Path
import pandas as pd

from src.services.campaign_service import CampaignService
from src.core.communication.sms_service import sms_service
from src.core.data_processing.data_loader import DataLoader

router = APIRouter()
campaign_service = CampaignService()
data_loader = DataLoader()
logger = logging.getLogger(__name__)


# -------------------------------------------------
# LAUNCH RETENTION CAMPAIGN
# -------------------------------------------------
@router.post("/sms/retention")
async def launch_retention_campaign(
    customer_limit: int = 10,
    churn_risk: str = "High",
):
    """
    Launch SMS retention campaign for customers
    """
    try:
        logger.info(
            f"Launching retention campaign: limit={customer_limit}, risk={churn_risk}"
        )

        campaign_data = campaign_service.prepare_campaign(
            customer_limit=customer_limit,
            churn_risk=churn_risk,
        )

        if not campaign_data:
            raise HTTPException(
                status_code=404,
                detail="No customers found for campaign",
            )

        campaign_results = campaign_service.execute_campaign(campaign_data)

        return {
            "message": "Retention campaign completed",
            "campaign_details": {
                "targeted_customers": len(campaign_data),
                "churn_risk_level": churn_risk,
                "customer_limit": customer_limit,
            },
            "campaign_results": campaign_results,
            "sample_messages": campaign_data[:3],
        }

    except Exception as e:
        logger.error(f"Error launching campaign: {e}")
        raise HTTPException(status_code=500, detail=str(e))


# -------------------------------------------------
# TEST SMS ENDPOINT
# -------------------------------------------------
@router.get("/sms/test")
async def test_sms_campaign(phone_number: Optional[str] = None):
    """
    Test SMS sending (safe demo endpoint)
    """
    try:
        if not phone_number:
            return {
                "message": "Test endpoint active",
                "note": "Provide phone_number query parameter to send a test SMS",
            }

        result = sms_service.send_sms(
            to_number=phone_number,
            message="Test message from FreshMart AI Retention System.",
        )

        return {
            "message": "Test SMS executed",
            "result": result,
        }

    except Exception as e:
        logger.error(f"Error testing SMS campaign: {e}")
        raise HTTPException(status_code=500, detail=str(e))


# -------------------------------------------------
# CAMPAIGN SERVICE STATUS
# -------------------------------------------------
@router.get("/status")
async def get_campaign_status():
    """
    Get campaign system health/status
    """
    try:
        status = campaign_service.get_campaign_status()
        customers_df = data_loader.load_customers()

        status.update(
            {
                "total_customers": len(customers_df),
                "customers_with_phone": int(customers_df["phone"].notna().sum()),
                "ready_for_campaign": (
                    status["sms_service"] == "Ready"
                    and status["ai_service"] == "Ready"
                ),
            }
        )

        return status

    except Exception as e:
        logger.error(f"Error getting campaign status: {e}")
        raise HTTPException(status_code=500, detail=str(e))


# -------------------------------------------------
# CAMPAIGN HISTORY
# -------------------------------------------------
@router.get("/history")
async def get_campaign_history():
    """
    Get campaign execution history
    """
    try:
        outputs_dir = Path("outputs")
        results_file = outputs_dir / "campaign_results.csv"

        if not results_file.exists():
            return {
                "total_campaigns": 0,
                "campaigns": [],
            }

        results_df = pd.read_csv(results_file)

        if results_df.empty or "campaign_id" not in results_df.columns:
            return {
                "total_campaigns": 0,
                "campaigns": [],
            }

        history = []

        for campaign_id in results_df["campaign_id"].unique():
            campaign_data = results_df[
                results_df["campaign_id"] == campaign_id
            ]

            successful = int(campaign_data["sms_success"].sum())
            total = len(campaign_data)

            history.append(
                {
                    "campaign_id": int(campaign_id),
                    "date": campaign_data["timestamp"].iloc[0],
                    "customers_targeted": total,
                    "successful": successful,
                    "failed": total - successful,
                    "success_rate": round(
                        (successful / total) * 100, 2
                    )
                    if total > 0
                    else 0,
                }
            )

        return {
            "total_campaigns": len(history),
            "campaigns": history[-10:],  # last 10 campaigns
        }

    except Exception as e:
        logger.error(f"Error getting campaign history: {e}")
        return {
            "total_campaigns": 0,
            "campaigns": [],
        }
