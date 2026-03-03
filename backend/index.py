from fastapi import FastAPI, WebSocket, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from datetime import datetime
import json
import asyncio

app = FastAPI()

# CORS config
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# In-memory card storage
cards_db = {}

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
    cards_db[key] = {
        "board": board_slug,
        "stage": stage,
        "task": task,
        "synced_at": datetime.utcnow().isoformat()
    }
    
    # Check if Q2 inputs card is complete
    if board_slug == "ops-blocked" and task["id"] == "task-1":
        checklist = task.get("checklist", [])
        all_complete = all(item.get("completed", False) for item in checklist)
        
        if all_complete:
            # TRIGGER: Phase 4 execution
            return {
                "status": "success",
                "message": "All Q2 inputs received! Phase 4 ready to launch.",
                "phase4_ready": True
            }
    
    return {"status": "success", "synced": True}

@app.get("/api/cards/{board_slug}")
def get_board_cards(board_slug: str):
    """Get all cards for a board"""
    board_cards = [v for k, v in cards_db.items() if v["board"] == board_slug]
    return {"cards": board_cards}

@app.post("/api/voice-transcribe")
async def transcribe_voice(data: dict):
    """Receive audio file and transcribe with local Whisper"""
    audio_url = data.get("audio_url")
    task_id = data.get("task_id")
    
    if not audio_url or not task_id:
        raise HTTPException(status_code=400, detail="Missing fields")
    
    # Placeholder: In real implementation, download and transcribe
    # For now, return ready-for-transcription status
    return {
        "status": "pending_transcription",
        "task_id": task_id,
        "message": "Audio received, transcription queued"
    }

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
