from fastapi import FastAPI
from fastapi.responses import JSONResponse

app = FastAPI()

@app.get("/")
def root():
    return {"status": "ok"}

@app.get("/health")
def health():
    return {"ok": True}

@app.get("/api/v1/boards")
def boards():
    return {"boards": [
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
    ]}
