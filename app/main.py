from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.api import auth

app = FastAPI(title="Peak Lenders API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Allows all origins for easy local setup
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(auth.router, prefix="/api/auth", tags=["Auth"])

@app.get("/")
def health_check():
    return {"status": "ok", "message": "Peak Lenders Backend is live!"}
