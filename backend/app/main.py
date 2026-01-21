from fastapi import FastAPI
from app.api.health import router as health_router

app = FastAPI(title="AI Task Manager API")

app.include_router(health_router)

@app.get("/")
def root():
    return {"message": "AI Task Manager API is running"}
