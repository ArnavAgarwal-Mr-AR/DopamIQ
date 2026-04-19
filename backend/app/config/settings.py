from pydantic_settings import BaseSettings, SettingsConfigDict
from functools import lru_cache


class Settings(BaseSettings):
    # =========================
    # App Config
    # =========================
    APP_NAME: str
    DEBUG: bool
    VERSION: str

    # =========================
    # Server Config
    # =========================
    HOST: str
    PORT: int

    # =========================
    # Database Config
    # =========================
    POSTGRES_URL: str
    REDIS_URL: str

    # =========================
    # Feature Store
    # =========================
    FEATURE_VERSION: int

    # =========================
    # ML Config
    # =========================
    MODEL_TYPE: str

    # =========================
    # LLM Config
    # =========================
    LLM_PROVIDER: str
    LLM_MODEL: str
    LLM_TIMEOUT: int

    model_config = SettingsConfigDict(env_file=(".env", ".env.local"), case_sensitive=True)


# Singleton (important for FastAPI)
@lru_cache()
def get_settings():
    return Settings()


settings = get_settings()