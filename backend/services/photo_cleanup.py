# backend/services/photo_cleanup.py

import os
import time
from pathlib import Path

PHOTO_DIR = Path("backend/photos")
TTL_SECONDS = 60 * 60 * 24  # 24 hours

def cleanup_old_photos():
    if not PHOTO_DIR.exists():
        return

    now = time.time()

    for file in PHOTO_DIR.iterdir():
        if not file.is_file():
            continue

        if now - file.stat().st_mtime > TTL_SECONDS:
            try:
                file.unlink()
                print(f"🧹 Deleted expired photo: {file.name}")
            except Exception as e:
                print(f"❌ Failed to delete {file.name}: {e}")
