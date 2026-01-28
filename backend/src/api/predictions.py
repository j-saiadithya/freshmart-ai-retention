"""
Churn predictions API endpoints
"""
from fastapi import APIRouter, HTTPException, Query
import pandas as pd
from typing import Dict
import logging

from src.core.data_processing.data_loader import DataLoader
from src.core.data_processing.feature_engineering import FeatureEngineer

router = APIRouter()
data_loader = DataLoader()
feature_engineer = FeatureEngineer()
logger = logging.getLogger(__name__)


# -------------------------------------------------
# MAIN CHURN ENDPOINT (FAST)
# -------------------------------------------------
@router.get("/churn")
async def get_churn_predictions(
    limit: int = Query(100, ge=1, le=1000, description="Number of records to return")
):
    """
    Get churn predictions (precomputed preferred)
    """
    try:
        # ✅ 1. Load precomputed predictions (FAST PATH)
        churn_df = data_loader.load_churn_predictions()

        if churn_df is not None:
            logger.info("Using precomputed churn predictions")

            return {
                "source": "precomputed",
                "total_customers": len(churn_df),
                "high_risk": int((churn_df["churn_risk"] == "High").sum()),
                "medium_risk": int((churn_df["churn_risk"] == "Medium").sum()),
                "low_risk": int((churn_df["churn_risk"] == "Low").sum()),
                "data": churn_df.head(limit).to_dict(orient="records"),
            }

        # -------------------------------------------------
        # 🔁 DEV FALLBACK (ONLY IF CSV IS MISSING)
        # -------------------------------------------------
        logger.warning("Precomputed churn predictions not found. Calculating on the fly.")

        data = data_loader.load_all_data()
        customers_df = data["customers"]
        transactions_df = data["transactions"]

        rfm_df = feature_engineer.calculate_rfm_features(transactions_df)
        features_df = feature_engineer.create_churn_features(customers_df, rfm_df)
        churn_df = feature_engineer.predict_churn_risk(features_df)

        return {
            "source": "calculated",
            "total_customers": len(churn_df),
            "high_risk": int((churn_df["churn_risk"] == "High").sum()),
            "medium_risk": int((churn_df["churn_risk"] == "Medium").sum()),
            "low_risk": int((churn_df["churn_risk"] == "Low").sum()),
            "data": churn_df.head(limit).to_dict(orient="records"),
        }

    except Exception as e:
        logger.error(f"Churn prediction failed: {e}")
        raise HTTPException(status_code=500, detail="Churn prediction failed")


# -------------------------------------------------
# SINGLE CUSTOMER CHURN (FAST)
# -------------------------------------------------
@router.get("/churn/{customer_id}")
async def get_customer_churn_prediction(customer_id: str):
    """
    Get churn prediction for a specific customer
    """
    try:
        churn_df = data_loader.load_churn_predictions()

        if churn_df is None:
            raise HTTPException(
                status_code=404,
                detail="Precomputed churn predictions not available"
            )

        customer = churn_df[churn_df["customer_id"] == customer_id]

        if customer.empty:
            raise HTTPException(status_code=404, detail="Customer not found")

        return customer.iloc[0].to_dict()

    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Customer churn lookup failed: {e}")
        raise HTTPException(status_code=500, detail="Customer churn lookup failed")


# -------------------------------------------------
# CHURN DISTRIBUTION (FAST)
# -------------------------------------------------
@router.get("/stats/distribution")
async def get_churn_distribution():
    """
    Get churn risk distribution
    """
    try:
        churn_df = data_loader.load_churn_predictions()

        if churn_df is None or churn_df.empty:
            raise HTTPException(status_code=404, detail="No churn data available")

        distribution = churn_df["churn_risk"].value_counts().to_dict()

        return {
            "distribution": distribution,
            "statistics": {
                "total_customers": len(churn_df),
                "high_risk_percentage": round((distribution.get("High", 0) / len(churn_df)) * 100, 2),
                "medium_risk_percentage": round((distribution.get("Medium", 0) / len(churn_df)) * 100, 2),
                "low_risk_percentage": round((distribution.get("Low", 0) / len(churn_df)) * 100, 2),
                "avg_churn_probability": float(churn_df["churn_probability"].mean()),
                "min_churn_probability": float(churn_df["churn_probability"].min()),
                "max_churn_probability": float(churn_df["churn_probability"].max()),
            },
        }

    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Churn distribution failed: {e}")
        raise HTTPException(status_code=500, detail="Churn distribution failed")


# -------------------------------------------------
# HIGH RISK CUSTOMERS (FAST)
# -------------------------------------------------
@router.get("/high-risk")
async def get_high_risk_customers(
    limit: int = Query(100, ge=1, le=500, description="Max high-risk customers")
):
    """
    Get top high-risk customers
    """
    try:
        churn_df = data_loader.load_churn_predictions()

        if churn_df is None or churn_df.empty:
            raise HTTPException(status_code=404, detail="No churn data available")

        high_risk_df = churn_df[churn_df["churn_risk"] == "High"] \
            .sort_values("churn_probability", ascending=False) \
            .head(limit)

        return {
            "count": len(high_risk_df),
            "data": high_risk_df.to_dict(orient="records"),
        }

    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"High-risk lookup failed: {e}")
        raise HTTPException(status_code=500, detail="High-risk lookup failed")
