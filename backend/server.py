from fastapi import FastAPI, WebSocket
from ws import broadcaster

app = FastAPI()

@app.websocket("/ws/state")
async def state_socket(ws: WebSocket):
    await broadcaster.connect(ws)
    try:
        while True:
            await ws.receive_text()  # keep alive
    except:
        broadcaster.disconnect(ws)
