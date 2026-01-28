"""
Data loading from CSV files
"""
import pandas as pd
import numpy as np
from pathlib import Path
from typing import Dict, Optional
import logging
from datetime import datetime, timedelta

from src.utils.config import settings

logger = logging.getLogger(__name__)


class DataLoader:
    """
    Centralized data loading for FreshMart
    """

    def __init__(self):
        self.data_dir: Path = settings.data_dir
        logger.info(f"DataLoader using data directory: {self.data_dir}")

    # -----------------------------
    # Customers
    # -----------------------------
    def load_customers(self) -> pd.DataFrame:
        file_path = self.data_dir / "customers.csv"

        if not file_path.exists():
            logger.warning("customers.csv not found. Using DEV sample data.")
            return self._create_sample_customers()

        try:
            df = pd.read_csv(file_path)

            # Handle empty / invalid CSV
            if df.empty or len(df.columns) == 0:
                raise ValueError("customers.csv is empty or invalid")

            self._validate_customers(df)
            return df

        except Exception as e:
            logger.error(f"Failed to load customers.csv: {e}")
            return self._create_sample_customers()

    def _validate_customers(self, df: pd.DataFrame):
        # Required columns (phone NOT mandatory in raw data)
        required_cols = {"customer_id", "first_name", "last_name"}
        missing = required_cols - set(df.columns)

        if missing:
            raise ValueError(f"customers.csv missing columns: {missing}")

        # ✅ SINGLE DEMO PHONE NUMBER FOR ALL CUSTOMERS
        if "phone" not in df.columns:
            logger.warning(
                "phone column missing. Using a single demo phone number for all customers."
            )
            df["phone"] = "+919704300547"  # DEMO NUMBER

    def _create_sample_customers(self) -> pd.DataFrame:
        logger.info("Creating DEV sample customers")

        size = 50
        customer_ids = [f"CUST{100000 + i}" for i in range(size)]

        return pd.DataFrame({
            "customer_id": customer_ids,
            "first_name": [f"Customer{i}" for i in range(size)],
            "last_name": ["Demo"] * size,
            "phone": "+919704300547",  # single demo number
            "city": np.random.choice(
                ["New York", "Chicago", "Houston", "Phoenix"], size
            ),
            "loyalty_tier": np.random.choice(
                ["Bronze", "Silver", "Gold", "Platinum"], size
            ),
            "avg_monthly_spend": np.random.randint(20, 200, size)
        })

    # -----------------------------
    # Products
    # -----------------------------
    def load_products(self) -> pd.DataFrame:
        file_path = self.data_dir / "products.csv"

        if not file_path.exists():
            logger.warning("products.csv not found. Using DEV sample products.")
            return self._create_sample_products()

        try:
            df = pd.read_csv(file_path)
            if df.empty:
                raise ValueError("products.csv is empty")
            return df
        except Exception as e:
            logger.error(f"Failed to load products.csv: {e}")
            return self._create_sample_products()

    def _create_sample_products(self) -> pd.DataFrame:
        size = 20
        categories = ["Grocery", "Dairy", "Produce", "Bakery", "Meat"]

        return pd.DataFrame({
            "product_id": [f"PROD{1000 + i}" for i in range(size)],
            "product_name": [f"Product {i+1}" for i in range(size)],
            "category": np.random.choice(categories, size),
            "price": np.round(np.random.uniform(1.5, 20.0, size), 2)
        })

    # -----------------------------
    # Transactions
    # -----------------------------
    def load_transactions(self) -> pd.DataFrame:
        file_path = self.data_dir / "transactions.csv"

        if not file_path.exists():
            logger.warning("transactions.csv not found. Using DEV sample transactions.")
            return self._create_sample_transactions()

        try:
            df = pd.read_csv(file_path)
            if df.empty:
                raise ValueError("transactions.csv is empty")

            df["date"] = pd.to_datetime(df["date"], errors="coerce")
            return df

        except Exception as e:
            logger.error(f"Failed to load transactions.csv: {e}")
            return self._create_sample_transactions()

    def _create_sample_transactions(self) -> pd.DataFrame:
        size = 1000
        start_date = datetime.now() - timedelta(days=730)

        return pd.DataFrame({
            "transaction_id": [f"TRANS{1000000 + i}" for i in range(size)],
            "customer_id": np.random.choice(
                [f"CUST{100000 + i}" for i in range(50)], size
            ),
            "product_id": np.random.choice(
                [f"PROD{1000 + i}" for i in range(20)], size
            ),
            "quantity": np.random.randint(1, 5, size),
            "amount": np.round(np.random.uniform(10, 200, size), 2),
            "date": [
                start_date + timedelta(days=np.random.randint(0, 730))
                for _ in range(size)
            ]
        })

    # -----------------------------
    # Churn Predictions
    # -----------------------------
    def load_churn_predictions(self) -> Optional[pd.DataFrame]:
        file_path = self.data_dir / "churn_predictions.csv"

        if not file_path.exists():
            logger.warning("churn_predictions.csv not found")
            return None

        try:
            df = pd.read_csv(file_path)
            return df if not df.empty else None
        except Exception as e:
            logger.error(f"Failed to load churn_predictions.csv: {e}")
            return None

    # -----------------------------
    # Load All
    # -----------------------------
    def load_all_data(self) -> Dict[str, Optional[pd.DataFrame]]:
        return {
            "customers": self.load_customers(),
            "products": self.load_products(),
            "transactions": self.load_transactions(),
            "churn_predictions": self.load_churn_predictions(),
        }
