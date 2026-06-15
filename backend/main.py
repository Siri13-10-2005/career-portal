from app.routes.user_routes import router as user_router
from app.database.db import db , client
from fastapi import FastAPI
from app.routes.job_routes import router as job_router
from app.routes.application_routes import router as application_router
from app.routes.upload_routes import router as upload_router
from app.routes.saved_job_routes import router as saved_job_router
from fastapi.middleware.cors import CORSMiddleware
from app.routes import admin_routes

app = FastAPI()
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "https://career-portal-lxc5.onrender.com",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(user_router)
app.include_router(job_router)
app.include_router(application_router)
app.include_router(upload_router)
app.include_router(saved_job_router)
app.include_router(admin_routes.router)

@app.get("/")
def home():
    return {"message": "AI Career Portal Backend Running Successfully"}

@app.get("/about")
def about():
    return {
        "project": "AI Career Portal",
        "developer": "Siri",
        "version": "1.0"
    }

@app.get("/db-test")
def db_test():
    client.admin.command("ping")
    return {"status": "MongoDB Connected Successfully"}

