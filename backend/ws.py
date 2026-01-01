# backend/ws.py

import asyncio
from typing import Set, Dict, Any
from fastapi import WebSocket


class StateBroadcaster:
    def __init__(self):
        self.connections: Set[WebSocket] = set()
        self.loop: asyncio.AbstractEventLoop | None = None

    def set_loop(self, loop: asyncio.AbstractEventLoop):
        self.loop = loop

    async def connect(self, ws: WebSocket):
        await ws.accept()
        self.connections.add(ws)

    def disconnect(self, ws: WebSocket):
        self.connections.discard(ws)

    async def broadcast(self, payload: Dict[str, Any]):
        for ws in list(self.connections):
            try:
                await ws.send_json(payload)
            except Exception:
                self.connections.discard(ws)

    def broadcast_threadsafe(self, payload: Dict[str, Any]):
        print("🔥 WS EMIT:", payload)

        if not self.loop:
            print("❌ NO EVENT LOOP SET")
            return

        asyncio.run_coroutine_threadsafe(
            self.broadcast(payload),
            self.loop
        )


broadcaster = StateBroadcaster()
