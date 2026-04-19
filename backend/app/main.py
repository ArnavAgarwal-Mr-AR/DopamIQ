# app/main.py

from fastapi import FastAPI
from contextlib import asynccontextmanager

from app.config.settings import settings
from app.config.logging import setup_logging, get_logger

# Import routers (you will create these)
from app.api.routes import scores, predictions, meta, llm, upload, trends, manipulation


# =========================
# Setup Logging
# =========================
setup_logging()
logger = get_logger(__name__)


# =========================
# Lifespan Events
# =========================
@asynccontextmanager
async def lifespan(app: FastAPI):
    logger.info("🚀 Starting Behavioral Scoring Engine...")

    # You can initialize:
    # - DB connections
    # - Redis
    # - Models

    yield

    logger.info("🛑 Shutting down application...")


# =========================
# FastAPI App
# =========================
app = FastAPI(
    title=settings.APP_NAME,
    version=settings.VERSION,
    debug=settings.DEBUG,
    lifespan=lifespan
)


# =========================
# Register Routes
# =========================
app.include_router(upload.router, prefix="/api", tags=["Upload"])
app.include_router(scores.router, prefix="/api", tags=["Scores"])
app.include_router(predictions.router, prefix="/api", tags=["Predictions"])
app.include_router(meta.router, prefix="/api", tags=["Meta"])
app.include_router(llm.router, prefix="/api", tags=["LLM"])
app.include_router(trends.router, prefix="/api", tags=["Trends"])
app.include_router(manipulation.router, prefix="/api", tags=["Manipulation"])


# =========================
# Health Check
# =========================
@app.get("/")
def root():
    return {
        "status": "running",
        "app": settings.APP_NAME,
        "version": settings.VERSION
    }


@app.get("/health")
def health_check():
    return {
        "status": "healthy"
    }