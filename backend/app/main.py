from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from dotenv import load_dotenv
import os

# Load environment variables
load_dotenv()

from app.api.health import router as health_router
from app.api.auth import router as auth_router
from app.api.tasks import router as tasks_router
from app.api.transactions import router as transactions_router
from app.db.database import engine, Base
from app.models import user, task, transaction

# Initialize DB tables
if os.getenv("VERCEL") == "1":
    Base.metadata.create_all(bind=engine)
elif "sqlite" in os.getenv("DATABASE_URL", "") and "/tmp" not in os.getenv("DATABASE_URL", ""):
    Base.metadata.create_all(bind=engine)

app = FastAPI(
    title="AI Task Manager API",
    root_path="/api" if os.getenv("VERCEL") == "1" else ""
)

# Enable CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(health_router)
app.include_router(auth_router)
app.include_router(tasks_router)
app.include_router(transactions_router)

@app.get("/")
def root():
    return {"message": "AI Task Manager API is running"}
