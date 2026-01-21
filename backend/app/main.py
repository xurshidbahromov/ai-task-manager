from fastapi import FastAPI
from app.api.health import router as health_router
from app.api.auth import router as auth_router
from app.api.tasks import router as tasks_router
from app.db.database import engine, Base
from app.models import user, task # Import all models to ensure tables are created

# In production, use migrations (Alembic). 
Base.metadata.create_all(bind=engine)

app = FastAPI(title="AI Task Manager API")

app.include_router(health_router)
app.include_router(auth_router)
app.include_router(tasks_router)

@app.get("/")
def root():
    return {"message": "AI Task Manager API is running"}
