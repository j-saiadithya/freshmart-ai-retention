"""
Customers API endpoints
"""
from fastapi import APIRouter, HTTPException, Query
from typing import Optional
import logging

from src.core.data_processing.data_loader import DataLoader  # ✅ FIXED IMPORT

router = APIRouter(
    prefix="/api/customers",
    tags=["Customers"]
)

data_loader = DataLoader()
logger = logging.getLogger(__name__)


@router.get("/")
async def get_customers(
    page: int = Query(1, ge=1, description="Page number"),
    limit: int = Query(100, ge=1, le=1000, description="Items per page"),
    churn_risk: Optional[str] = Query(None, description="Filter by churn risk"),
    search: Optional[str] = Query(None, description="Search by name or email"),
):
    """
    Get paginated list of customers
    """
    try:
        customers_df = data_loader.load_customers()

        if churn_risk and "churn_risk" in customers_df.columns:
            customers_df = customers_df[
                customers_df["churn_risk"] == churn_risk
            ]

        if search:
            s = search.lower()
            customers_df = customers_df[
                customers_df["first_name"].str.lower().str.contains(s, na=False)
                | customers_df["last_name"].str.lower().str.contains(s, na=False)
                | customers_df["email"].str.lower().str.contains(s, na=False)
            ]

        total = len(customers_df)
        total_pages = (total + limit - 1) // limit

        start = (page - 1) * limit
        end = start + limit

        page_data = customers_df.iloc[start:end]

        return {
            "data": page_data.to_dict(orient="records"),
            "pagination": {
                "page": page,
                "limit": limit,
                "total": total,
                "total_pages": total_pages,
                "has_next": page < total_pages,
                "has_previous": page > 1,
            },
        }

    except Exception as e:
        logger.error(f"Error getting customers: {e}")
        raise HTTPException(status_code=500, detail="Failed to fetch customers")


# ✅ STATIC ROUTES FIRST
@router.get("/stats/summary")
async def get_customers_summary():
    """
    Get customers summary statistics
    """
    try:
        customers_df = data_loader.load_customers()

        return {
            "total_customers": len(customers_df),
            "churn_distribution": customers_df.get(
                "churn_risk", []
            ).value_counts().to_dict()
            if "churn_risk" in customers_df.columns
            else {},
            "loyalty_distribution": customers_df.get(
                "loyalty_tier", []
            ).value_counts().to_dict()
            if "loyalty_tier" in customers_df.columns
            else {},
            "with_phone": int(customers_df["phone"].notna().sum()),
            "with_email": int(customers_df["email"].notna().sum()),
        }

    except Exception as e:
        logger.error(f"Error getting customers summary: {e}")
        raise HTTPException(status_code=500, detail="Failed to fetch summary")


@router.get("/{customer_id}")
async def get_customer(customer_id: str):
    """
    Get customer by ID
    """
    customers_df = data_loader.load_customers()
    customer = customers_df[
        customers_df["customer_id"] == customer_id
    ]

    if customer.empty:
        raise HTTPException(status_code=404, detail="Customer not found")

    return customer.iloc[0].to_dict()


@router.get("/{customer_id}/transactions")
async def get_customer_transactions(customer_id: str):
    """
    Get customer transaction history
    """
    transactions_df = data_loader.load_transactions()
    cust_txn = transactions_df[
        transactions_df["customer_id"] == customer_id
    ]

    if not cust_txn.empty and "date" in cust_txn.columns:
        cust_txn = cust_txn.sort_values("date", ascending=False)

    return {
        "customer_id": customer_id,
        "total_transactions": len(cust_txn),
        "total_spent": float(cust_txn["amount"].sum()) if not cust_txn.empty else 0,
        "avg_transaction": float(cust_txn["amount"].mean()) if not cust_txn.empty else 0,
        "last_purchase": cust_txn.iloc[0]["date"].strftime("%Y-%m-%d")
        if not cust_txn.empty
        else None,
        "transactions": cust_txn.head(20).to_dict(orient="records"),
    }
