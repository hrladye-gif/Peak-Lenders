from fastapi import FastAPI

app = FastAPI(
    title="Microfinance API",
    version="1.0.0"
)

@app.get("/")
def root():
    return {
        "status": "running",
        "app": "Microfinance API"
    }
