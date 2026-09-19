from fastapi import APIRouter
from app.api.v1.endpoints import analytics, poi, reports, health

api_router = APIRouter()

api_router.include_router(health.router, tags=["Health"])
api_router.include_router(analytics.router, prefix="/analytics", tags=["Analytics"])
api_router.include_router(poi.router, prefix="/poi", tags=["POI & Spatial"])
api_router.include_router(reports.router, prefix="/reports", tags=["Reports"])
