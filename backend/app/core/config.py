from typing import List
from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    PROJECT_NAME: str = "MakonSense Spatial Intelligence"
    VERSION: str = "1.0.0-MVP"
    API_V1_STR: str = "/api/v1"
    
    # Database configuration
    DATABASE_URL: str = "postgresql+asyncpg://makon_admin:makon_secure_password@localhost:5432/makonsense_db"
    SYNC_DATABASE_URL: str = "postgresql://makon_admin:makon_secure_password@localhost:5432/makonsense_db"
    USE_FALLBACK_SPATIAL: bool = True  # Enable embedded spatial engine if PostgreSQL is unavailable
    
    # CORS Configuration
    CORS_ORIGINS: List[str] = [
        "http://localhost:5173",
        "http://127.0.0.1:5173",
        "http://localhost:3000",
        "http://localhost:8000",
        "*"
    ]
    
    # Default city focus (Tashkent Center: Amir Temur Square)
    TASHKENT_LAT: float = 41.311081
    TASHKENT_LON: float = 69.240562
    
    # MakonScore Factor Weights
    WEIGHT_TRANSIT: float = 0.30     # w_t (500m radius)
    WEIGHT_ANCHOR: float = 0.25      # w_a (800m radius)
    WEIGHT_COMPETITION: float = 0.25 # w_c (400m radius)
    WEIGHT_RESIDENTIAL: float = 0.20 # w_r (600m radius)

    model_config = SettingsConfigDict(
        env_file=".env",
        env_file_encoding="utf-8",
        case_sensitive=True,
        extra="ignore"
    )


settings = Settings()
