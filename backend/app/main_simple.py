"""Minimal FastAPI app for debugging deployment issues."""

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI(
    title="Mission Control API",
    version="0.1.0",
)

@app.get("/health")
def health():
    return {"ok": True, "status": "healthy"}

@app.get("/api/v1/boards")
def boards():
    return {"boards": []}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
