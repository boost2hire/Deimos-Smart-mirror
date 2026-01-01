import cv2
import uuid
import os
import time
from ws import broadcaster

PHOTO_DIR = "photos"
PHOTO_TTL_SECONDS = 24 * 60 * 60  # 24 hours

os.makedirs(PHOTO_DIR, exist_ok=True)


def take_photo():
    # --- Open camera ---
    cam = cv2.VideoCapture(0)

    if not cam.isOpened():
        return "Camera is not available."

    # --- 🔥 Camera warm-up (CRITICAL FIX) ---
    # Allow auto-exposure / focus to settle
    for _ in range(15):
        cam.read()
        time.sleep(0.03)

    # --- Capture frame ---
    ret, frame = cam.read()
    cam.release()

    if not ret or frame is None:
        return "Sorry, I couldn't take the photo."

    # --- Save image ---
    filename = f"{int(time.time())}_{uuid.uuid4().hex}.jpg"
    path = os.path.join(PHOTO_DIR, filename)

    cv2.imwrite(path, frame)

    # --- Public URL ---
    photo_url = f"/photos/{filename}"

    # --- Notify frontend ---
    broadcaster.broadcast_threadsafe({
        "type": "photo_ready",
        "url": photo_url
    })

    return (
        "Photo taken. Scan the QR code to download. "
        "It will expire in 24 hours."
    )
