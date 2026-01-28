"""
FreshMart AI Retention - FastAPI Backend
Main entry point
"""

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from datetime import datetime

# Core settings
from src.utils.config import settings

# API routers
from src.api.customers import router as customers_router
from src.api.predictions import router as predictions_router
from src.api.campaigns import router as campaigns_router
from src.api.analytics import router as analytics_router

# -------------------------
# FastAPI App
# -------------------------
app = FastAPI(
    title="FreshMart AI Retention API",
    description="AI-powered customer retention system",
    version="1.0.0",
    docs_url="/docs",
    redoc_url="/redoc",
)

# -------------------------
# Middleware
# -------------------------
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.CORS_ORIGINS or ["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# -------------------------
# Routers (PREFIX ONLY HERE)
# -------------------------
app.include_router(customers_router, prefix="/api/customers", tags=["Customers"])
app.include_router(predictions_router, prefix="/api/predictions", tags=["Predictions"])
app.include_router(campaigns_router, prefix="/api/campaigns", tags=["Campaigns"])
app.include_router(analytics_router, prefix="/api/analytics", tags=["Analytics"])

# -------------------------
# Health & Root
# -------------------------
@app.get("/", tags=["Health"])
async def root():
    return {
        "message": "FreshMart AI Retention API is running",
        "status": "ok",
        "timestamp": datetime.now().isoformat(),
        "docs": "/docs",
    }

@app.get("/health", tags=["Health"])
async def health():
    return {
        "status": "healthy",
        "timestamp": datetime.now().isoformat(),
    }
