from pydantic_settings import BaseSettings, SettingsConfigDict
from functools import lru_cache


class Settings(BaseSettings):
    # =========================
    # App Config
    # =========================
    APP_NAME: str = "Dopamiq"
    DEBUG: bool = False
    VERSION: str = "1.0.0"

    # =========================
    # Server Config
    # =========================
    HOST: str = "0.0.0.0"
    PORT: int = 8000

    # =========================
    # Database Config
    # =========================
    POSTGRES_URL: str = ""
    REDIS_URL: str = ""

    # =========================
    # Feature Store
    # =========================
    FEATURE_VERSION: int = 1

    # =========================
    # ML Config
    # =========================
    MODEL_TYPE: str = "heuristic"

    # =========================
    # LLM Config
    # =========================
    LLM_PROVIDER: str = "openai"
    LLM_MODEL: str = "gpt-3.5-turbo"
    LLM_TIMEOUT: int = 30

    model_config = SettingsConfigDict(env_file=(".env", ".env.local"), case_sensitive=True)


# Singleton (important for FastAPI)
@lru_cache()
def get_settings():
    return Settings()


settings = get_settings()
