from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker, declarative_base
import os
from dotenv import load_dotenv
load_dotenv()

# Vercel Compatibility:
# 1. If DATABASE_URL is missing, default to a temporary SQLite file in /tmp (writable in serverless).
# 2. If running locally, it uses .env value or falls back to local file.
DATABASE_URL = os.getenv("DATABASE_URL")

# Vercel compatibility: Force /tmp for SQLite because the root is read-only
if os.getenv("VERCEL") == "1" or not DATABASE_URL:
    if not DATABASE_URL or "sqlite" in DATABASE_URL:
        DATABASE_URL = "sqlite:////tmp/ai_tasks.db"

connect_args = {}
if DATABASE_URL and "sqlite" in DATABASE_URL:
    connect_args = {"check_same_thread": False}

engine = create_engine(
    DATABASE_URL, connect_args=connect_args
)
SessionLocal = sessionmaker(bind=engine, autoflush=False, autocommit=False)

Base = declarative_base()
