"""Minimal FastAPI app for Vercel."""
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI(title="Mission Control API")

# CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["https://mc.angelinvestorsnetwork.com", "http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/health")
def health():
    """Health check endpoint."""
    return {"ok": True, "status": "healthy"}

@app.get("/api/v1/boards")
def boards():
    """List all boards."""
    return {
        "boards": [
            {"id": "1", "name": "AIN: Lead Pipeline", "slug": "ain-lead-pipeline"},
            {"id": "2", "name": "AIN: CROS Clients", "slug": "ain-cros-clients"},
            {"id": "3", "name": "Investing: Deal Pipeline", "slug": "investing-deal-pipeline"},
            {"id": "4", "name": "Investing: Portfolio", "slug": "investing-portfolio"},
            {"id": "5", "name": "WGOOAA: Growth", "slug": "wgooaa-growth"},
            {"id": "6", "name": "WGOOAA: Content", "slug": "wgooaa-content"},
            {"id": "7", "name": "Patriot: M&A Pipeline", "slug": "patriot-ma-pipeline"},
            {"id": "8", "name": "Patriot: Investor Outreach", "slug": "patriot-investor-outreach"},
            {"id": "9", "name": "Launch Commerce: Features", "slug": "lc-features"},
            {"id": "10", "name": "AIN FX: Tracking", "slug": "ain-fx-tracking"},
            {"id": "11", "name": "Angel & Heroes: Recovery", "slug": "ah-recovery"},
            {"id": "12", "name": "Ops: Content Pipeline", "slug": "ops-content"},
            {"id": "13", "name": "Ops: Tech Build", "slug": "ops-tech"},
            {"id": "14", "name": "Ops: Ideas", "slug": "ops-ideas"},
            {"id": "15", "name": "Ops: Blocked", "slug": "ops-blocked"},
        ]
    }

@app.get("/api/v1/boards/{board_id}/tasks")
def board_tasks(board_id: str):
    """List tasks for a board."""
    return {"tasks": [], "board_id": board_id}

@app.post("/api/v1/boards/{board_id}/tasks")
def create_task(board_id: str, title: str, status: str = "inbox"):
    """Create a task."""
    return {"id": "task-1", "title": title, "status": status, "board_id": board_id}
