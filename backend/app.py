import asyncio
import threading
import time, os
from datetime import datetime, timedelta
from fastapi import FastAPI, WebSocket, HTTPException
from contextlib import asynccontextmanager
from fastapi.middleware.cors import CORSMiddleware
from dotenv import load_dotenv

from voice.wake_word import wait_for_wake_word
from voice.stt import record_command, speech_to_text
from voice.tts import speak
from services.weather import get_weather
from services.youtube import search_youtube
from command_handler import handle_command
from ws import broadcaster
from fastapi.staticfiles import StaticFiles
from services.photo_cleanup import cleanup_old_photos
from fastapi.responses import FileResponse
from fastapi.responses import HTMLResponse
from fastapi import status
from fastapi.responses import RedirectResponse
from fastapi import FastAPI
from supabase_client import supabase
from codegen import generate_code

load_dotenv()

PHOTO_DIR = "photos"
PICOVOICE_ACCESS_KEY = "pHuGqjUN87BobgYb648sTQ+6goqkj9nKAMNNVPEETaN9RzshEgoanA=="

# ---------------- VOICE LOOP ----------------
def voice_loop():
    while True:
        try:
            # IDLE
            broadcaster.broadcast_threadsafe({
                "type": "state",
                "state": "idle"
            })
            print("🟢 Waiting for wake word")

            wait_for_wake_word(
                access_key=PICOVOICE_ACCESS_KEY,
                keyword="voice/keywords/Hey-lumi_en_windows_v4_0_0.ppn"
            )

            # LISTENING
            broadcaster.broadcast_threadsafe({
                "type": "state",
                "state": "listening"
            })

            record_command()

            # THINKING
            broadcaster.broadcast_threadsafe({
                "type": "state",
                "state": "thinking"
            })

            text = speech_to_text()
            print("🎙 USER:", text)

            result = handle_command(text)
            print("🧠 HANDLE_COMMAND:", result)

            # RESPONSE
            broadcaster.broadcast_threadsafe({
                "type": "response",
                "response": result
            })

            # SPEAKING
            if isinstance(result, str):
                broadcaster.broadcast_threadsafe({
                    "type": "state",
                    "state": "speaking"
                })
                speak(result)

            # BACK TO IDLE
            broadcaster.broadcast_threadsafe({
                "type": "state",
                "state": "idle"
            })

        except Exception as e:
            print("VOICE LOOP ERROR:", e)
            time.sleep(1)

# ----------------Cleanup -----------------------

def photo_cleanup_loop():
    while True:
        cleanup_old_photos()
        time.sleep(60 * 60)  # run every hour

# ---------------- LIFESPAN ----------------
@asynccontextmanager
async def lifespan(app: FastAPI):
    print("🪞 Lumi backend started")

    # ✅ Register event loop FIRST (do not move this)
    broadcaster.set_loop(asyncio.get_running_loop())

    # 🎙 Voice loop
    voice_thread = threading.Thread(
        target=voice_loop,
        daemon=True
    )
    voice_thread.start()

    # 🧹 Photo cleanup loop (NEW)
    cleanup_thread = threading.Thread(
        target=photo_cleanup_loop,
        daemon=True
    )
    cleanup_thread.start()

    yield

    print("🛑 Lumi backend shutting down")



# ---------------- APP ----------------
app = FastAPI(lifespan=lifespan)

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:8080",          # local dev
        "https://photos.refboosts.com",   # production
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


app.mount("/photos", StaticFiles(directory=PHOTO_DIR), name="photos");


@app.get("/gallery", response_class=HTMLResponse)
def gallery():
    files = sorted(
        [f for f in os.listdir(PHOTO_DIR) if f.endswith(".jpg")],
        reverse=True
    )

    images_html = ""
    for f in files:
        images_html += f"""
        <div style="margin-bottom:20px;">
        <img src="/photos/{f}" style="max-width:100%;border-radius:12px;" />
        <br/>

        <a href="/photos/{f}" download
            style="display:inline-block;margin-top:8px;
            padding:10px 16px;background:#2563eb;color:white;
            text-decoration:none;border-radius:8px;">
            ⬇ Download
        </a>

        <button onclick="deletePhoto('{f}')"
            style="margin-left:8px;
            padding:10px 16px;
            background:#dc2626;
            color:white;
            border:none;
            border-radius:8px;
            cursor:pointer;">
            🗑 Delete
        </button>
        </div>
        """


    return f"""
    <html>
      <head>
        <title>Smart Mirror Gallery</title>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <style>
          body {{
            background:#0b0b0b;
            color:white;
            font-family:system-ui;
            padding:16px;
          }}
        </style>
      </head>
      <body>
        <h2>📸 Smart Mirror Gallery</h2>
        {images_html if images_html else "<p>No photos yet</p>"}
       <script>
            async function deletePhoto(filename) {{
            if (!confirm("Delete this photo?")) return;

            const res = await fetch("/photos/" + filename, {{
                method: "DELETE"
            }});

            if (res.ok) {{
                location.reload();
            }} else {{
                alert("Failed to delete photo");
            }}
            }}
  </script>
      </body>
    </html>
    """


@app.get("/")
def root():
    return RedirectResponse("/gallery")


@app.delete("/photos/{filename}", status_code=status.HTTP_204_NO_CONTENT)
def delete_photo(filename: str):
    path = os.path.join(PHOTO_DIR, filename)

    if not os.path.exists(path):
        raise HTTPException(status_code=404, detail="File not found")

    os.remove(path)
# ---------------- WEBSOCKET ----------------
@app.websocket("/ws/state")
async def state_socket(ws: WebSocket):
    await broadcaster.connect(ws)
    try:
        while True:
            await ws.receive_text()  # keepalive
    except:
        pass
    finally:
        broadcaster.disconnect(ws)

# -----------------SUPABASE------------------------------

@app.get("/health")
def health():
    res = supabase.table("devices").select("*").limit(1).execute()
    return {
        "status": "ok",
        "supabase": "connected",
        "rows": len(res.data)
    }


# ------------------- REQUEST-LINK---------------------------------------------

@app.post("/device/request-link")
def request_link(device_id: str):
    code = generate_code()
    expires_at = datetime.utcnow() + timedelta(minutes=5)

    supabase.table("device_links").insert({
        "device_id": device_id,
        "code": code,
        "expires_at": expires_at.isoformat()
    }).execute()

    return {
        "device_id": device_id,
        "code": code,
        "expires_in": 300
    }


#-----------------------CONFIRM-LINK-----------------------------

@app.post("/device/confirm-link")
def confirm_link(code: str, user_id: str):
    now = datetime.utcnow().isoformat()

    res = supabase.table("device_links") \
        .select("*") \
        .eq("code", code) \
        .eq("used", False) \
        .limit(1) \
        .execute()

    if not res.data:
        raise HTTPException(
            status_code=400,
            detail="Invalid, expired, or already-used code"
        )

    link = res.data[0]

    # Link device to user
    supabase.table("devices").upsert({
        "device_id": link["device_id"],
        "user_id": user_id,
        "linked": True
    }).execute()

    # Invalidate code
    supabase.table("device_links") \
        .update({"used": True}) \
        .eq("id", link["id"]) \
        .execute()

    return {
        "status": "linked",
        "device_id": link["device_id"]
    }


@app.get("/download/{filename}")
def download_photo(filename: str):
    path = os.path.join("photos", filename)
    return FileResponse(
        path,
        media_type="image/jpeg",
        filename=filename
    )

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
