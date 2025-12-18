from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from backend.api import router
import os
from dotenv import load_dotenv

load_dotenv()

app = FastAPI(title="SME Resilience Simulator API")

# Configure CORS
origins = os.getenv("ALLOWED_ORIGINS", "*").split(",")

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(router, prefix="/api")

@app.get("/")
def read_root():
    return {"message": "Welcome to SME Resilience Simulator API"}
