# app/config/logging.py

import logging
import sys


def setup_logging():
    logger = logging.getLogger()
    logger.setLevel(logging.INFO)

    # Remove duplicate handlers (important in FastAPI reload)
    if logger.hasHandlers():
        logger.handlers.clear()

    handler = logging.StreamHandler(sys.stdout)

    formatter = logging.Formatter(
        fmt="%(asctime)s | %(levelname)s | %(name)s | %(message)s",
        datefmt="%Y-%m-%d %H:%M:%S"
    )

    handler.setFormatter(formatter)
    logger.addHandler(handler)


def get_logger(name: str):
    return logging.getLogger(name)