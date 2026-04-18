# app/config/settings.py

from pydantic_settings import BaseSettings, SettingsConfigDict
from functools import lru_cache


class Settings(BaseSettings):
    # =========================
    # App Config
    # =========================
    APP_NAME: str = "Behavioral Scoring Engine"
    DEBUG: bool = True
    VERSION: str = "1.0.0"

    # =========================
    # Server Config
    # =========================
    HOST: str = "0.0.0.0"
    PORT: int = 8000

    # =========================
    # Database Config
    # =========================
    POSTGRES_URL: str = "postgresql://user:password@localhost:5432/bse"
    REDIS_URL: str = "redis://localhost:6379/0"

    # =========================
    # Feature Store
    # =========================
    FEATURE_VERSION: int = 1

    # =========================
    # ML Config
    # =========================
    MODEL_TYPE: str = "baseline"  # baseline | xgboost | lstm

    # =========================
    # LLM Config
    # =========================
    LLM_PROVIDER: str = "openai"
    LLM_MODEL: str = "gpt-4o-mini"
    LLM_TIMEOUT: int = 10

    model_config = SettingsConfigDict(env_file=(".env", ".env.local"), case_sensitive=True)


# Singleton (important for FastAPI)
@lru_cache()
def get_settings():
    return Settings()


settings = get_settings()