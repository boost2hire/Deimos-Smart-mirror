# backend/command_handler.py

import asyncio
from intent_router import route_intent
from handlers import music, alarm, gpt
from services.weather import get_weather
from handlers import alarm
from ws import broadcaster
from handlers.alarm import handle_set_alarm, stop_alarm
from handlers.camera import take_photo





def handle_command(text: str) -> str:
    intent = route_intent(text)
    t = intent["type"]

    # 🎵 Music
    if t == "play_music":
        return music.play(intent["query"])

    if t == "pause_music":
        return music.pause()

    if t == "stop_music":
        return music.stop()

    
    if t == "set_alarm":
     return alarm.handle_set_alarm(
        intent["text"],
        notify=broadcaster.broadcast_threadsafe
    )

    if t == "stop_alarm":
        return stop_alarm()

    if t == "take_photo":
        return take_photo()
    # 🌤 Weather
    if t == "weather":
        return get_weather()

    # 🤖 GPT fallback
    return gpt.ask_gpt(intent["text"])
