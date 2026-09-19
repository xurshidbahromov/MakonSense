import logging
from typing import AsyncGenerator
from sqlalchemy.ext.asyncio import AsyncSession, create_async_engine, async_sessionmaker
from sqlalchemy.orm import declarative_base
from app.core.config import settings

logger = logging.getLogger("makonsense.database")

Base = declarative_base()

# Async Engine for PostgreSQL + PostGIS
try:
    engine = create_async_engine(
        settings.DATABASE_URL,
        echo=False,
        future=True,
        pool_pre_ping=True,
    )
    async_session_factory = async_sessionmaker(
        engine,
        class_=AsyncSession,
        expire_on_commit=False,
    )
except Exception as e:
    logger.warning(f"Could not initialize async database engine: {e}. Fallback spatial engine will be active.")
    engine = None
    async_session_factory = None


async def get_db() -> AsyncGenerator[AsyncSession, None]:
    """Dependency injection generator for database sessions."""
    if async_session_factory is None:
        yield None
        return
        
    async with async_session_factory() as session:
        try:
            yield session
        except Exception as e:
            await session.rollback()
            logger.error(f"Database session error: {e}")
            raise
        finally:
            await session.close()


async def check_db_connection() -> bool:
    """Check if PostgreSQL/PostGIS connection is active."""
    if engine is None:
        return False
    try:
        from sqlalchemy import text
        async with engine.connect() as conn:
            await conn.execute(text("SELECT 1"))
            return True
    except Exception as e:
        logger.info(f"PostgreSQL connection unavailable: {e}. Using embedded spatial fallback.")
        return False
