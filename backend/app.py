import asyncio
import threading
import time
from fastapi import FastAPI, WebSocket, HTTPException
from contextlib import asynccontextmanager
from fastapi.middleware.cors import CORSMiddleware
from dotenv import load_dotenv

from voice.wake_word import wait_for_wake_word
from voice.stt import record_command, speech_to_text
from voice.tts import speak
from services.weather import get_weather
from command_handler import handle_command
from services.youtube import search_youtube

load_dotenv()

PICOVOICE_ACCESS_KEY = "pHuGqjUN87BobgYb648sTQ+6goqkj9nKAMNNVPEETaN9RzshEgoanA=="

# ---------------- GLOBALS ----------------
connections: set[WebSocket] = set()
main_loop: asyncio.AbstractEventLoop | None = None


# ---------------- WS HELPERS ----------------
async def broadcast(payload: dict):
    for ws in list(connections):
        try:
            await ws.send_json(payload)
        except:
            connections.discard(ws)


def emit(payload: dict):
    if main_loop:
        main_loop.call_soon_threadsafe(
            asyncio.create_task,
            broadcast(payload)
        )


def emit_state(state: str):
    print(f"STATE::{state}")
    emit({"state": state})


def emit_response(response):
    # ⚠️ DO NOT override state here
    emit({
        "response": response
    })


# ---------------- VOICE LOOP ----------------
def voice_loop():
    while True:
        try:
            emit_state("idle")
            print("🟢 Waiting for wake word")

            wait_for_wake_word(
                access_key=PICOVOICE_ACCESS_KEY,
                keyword="voice/keywords/Hey-lumi_en_windows_v4_0_0.ppn"
            )

            emit_state("listening")
            record_command()

            emit_state("thinking")
            text = speech_to_text()
            print("🎙 USER:", text)

            result = handle_command(text)
            print("🧠 HANDLE_COMMAND:", result)

            # 🔔 ALWAYS send response to frontend
            emit_response(result)

            # 🗣 Speak ONLY if result is TEXT
            if isinstance(result, str):
                emit_state("speaking")
                speak(result)
                emit_state("idle")

            # 🎵 If result is action (music), DO NOTHING else
            # Frontend will handle playback

        except Exception as e:
            print("VOICE LOOP ERROR:", e)
            time.sleep(1)


# ---------------- LIFESPAN ----------------
@asynccontextmanager
async def lifespan(app: FastAPI):
    global main_loop

    print("🪞 Lumi backend started")
    main_loop = asyncio.get_running_loop()

    thread = threading.Thread(target=voice_loop, daemon=True)
    thread.start()

    yield

    print("🛑 Lumi backend shutting down")


# ---------------- APP ----------------
app = FastAPI(lifespan=lifespan)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:8080"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# ---------------- WEBSOCKET ----------------
@app.websocket("/ws/state")
async def state_socket(ws: WebSocket):
    await ws.accept()
    connections.add(ws)

    try:
        while True:
            # frontend keepalive (ignored)
            await ws.receive_text()
    except:
        connections.discard(ws)


# ---------------- WEATHER API ----------------
@app.get("/api/weather")
def weather():
    try:
        return get_weather()
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
    
    # ---------------- YOUTUBE ----------------

@app.get("/api/youtube/search")
def youtube_search(q: str):
    video_id = search_youtube(q)
    if not video_id:
        return {"error": "No results"}
    return {"videoId": video_id}
