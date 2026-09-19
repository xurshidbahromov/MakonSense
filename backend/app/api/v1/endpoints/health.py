from fastapi import APIRouter
from app.core.config import settings
from app.core.database import check_db_connection

router = APIRouter()


@router.get("/health")
async def health_check():
    """Health check endpoint verifying system state and database availability."""
    db_ok = await check_db_connection()
    return {
        "status": "healthy",
        "service": settings.PROJECT_NAME,
        "version": settings.VERSION,
        "database": {
            "type": "PostgreSQL + PostGIS",
            "connected": db_ok,
            "mode": "PostGIS Live" if db_ok else "Embedded Spatial Fallback Active"
        },
        "target_city": "Tashkent, Uzbekistan"
    }
