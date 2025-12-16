from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from backend.api import router

app = FastAPI(title="Sustainability Tracker API")

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # For development, allow all. In production, be specific.
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(router, prefix="/api")

@app.get("/")
def read_root():
    return {"message": "Welcome to Sustainability Tracker API"}
