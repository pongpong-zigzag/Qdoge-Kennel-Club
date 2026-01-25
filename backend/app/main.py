import os

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.core.db import init_db

def create_app() -> FastAPI:

    app = FastAPI(title="Qdoge Kennel Club API", version="v0.1.0", root_path="/api")

    # CORS origins - support both local dev and production
    cors_origins = os.getenv("CORS_ORIGINS", "http://localhost:5173,http://localhost:80,http://72.60.123.249").split(",")

    app.add_middleware(
        CORSMiddleware,
        allow_origins=cors_origins,
        allow_credentials=True,
        allow_methods=["*"],
        allow_headers=["*"],
    )

    @app.get("/")
    def root():
        return {
            "service": "Qdoge Kennel Club API",
            "version": app.version
        }

    @app.post("/init-db")
    def initialize_database():
        init_db()
        return {
            "status": "success",
            "message": "Database initialized"
        }
    return app

app = create_app()