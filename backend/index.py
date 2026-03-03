from fastapi import FastAPI, WebSocket, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from datetime import datetime
import json
import asyncio
from typing import Dict, List

app = FastAPI()

# CORS config
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# In-memory storage
cards_db: Dict = {}
updates_log: List = []
last_checked = datetime.utcnow().isoformat()

@app.get("/health")
def health():
    return {"ok": True}

@app.post("/api/cards/sync")
async def sync_cards(data: dict):
    """Frontend sends card updates here"""
    board_slug = data.get("board")
    stage = data.get("stage")
    task = data.get("task")
    
    if not all([board_slug, stage, task]):
        raise HTTPException(status_code=400, detail="Missing fields")
    
    # Store card
    key = f"{board_slug}:{stage}:{task['id']}"
    update_record = {
        "key": key,
        "board": board_slug,
        "stage": stage,
        "task": task,
        "synced_at": datetime.utcnow().isoformat(),
        "has_voice_notes": len(task.get("voiceNotes", [])) > 0,
        "voice_note_count": len(task.get("voiceNotes", []))
    }
    
    cards_db[key] = update_record
    updates_log.append(update_record)
    
    # Check if Q2 inputs card is complete
    if board_slug == "ops-blocked" and task["id"] == "task-1":
        checklist = task.get("checklist", [])
        all_complete = all(item.get("completed", False) for item in checklist)
        
        if all_complete:
            return {
                "status": "success",
                "message": "All Q2 inputs received! Phase 4 ready to launch.",
                "phase4_ready": True,
                "task_id": task["id"],
                "board": board_slug,
                "stage": stage
            }
    
    return {
        "status": "success",
        "synced": True,
        "task_id": task["id"],
        "board": board_slug,
        "stage": stage
    }

@app.get("/api/updates/since/{timestamp}")
def get_updates_since(timestamp: str):
    """Get all updates since timestamp - agent polls this"""
    try:
        since = datetime.fromisoformat(timestamp)
    except:
        since = datetime.utcnow()
    
    recent_updates = [
        u for u in updates_log 
        if datetime.fromisoformat(u["synced_at"]) > since
    ]
    
    return {
        "updates": recent_updates,
        "count": len(recent_updates),
        "checked_at": datetime.utcnow().isoformat()
    }

@app.get("/api/cards/{board_slug}")
def get_board_cards(board_slug: str):
    """Get all cards for a board"""
    board_cards = [v for k, v in cards_db.items() if v["board"] == board_slug]
    return {"cards": board_cards}

@app.get("/api/cards/{board_slug}/{task_id}")
def get_card(board_slug: str, task_id: str):
    """Get specific card"""
    for key, card in cards_db.items():
        if card["board"] == board_slug and card["task"]["id"] == task_id:
            return card
    raise HTTPException(status_code=404, detail="Card not found")

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
