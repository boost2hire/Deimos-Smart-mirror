from typing import Set
from fastapi import WebSocket

class StateBroadcaster:
    def __init__(self):
        self.connections: Set[WebSocket] = set()

    async def connect(self, ws: WebSocket):
        await ws.accept()
        self.connections.add(ws)

    def disconnect(self, ws: WebSocket):
        self.connections.discard(ws)

    async def broadcast(self, state: str):
        for ws in list(self.connections):
            try:
                await ws.send_json({"state": state})
            except:
                self.connections.discard(ws)


broadcaster = StateBroadcaster()
