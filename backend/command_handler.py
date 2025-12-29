# backend/command_handler.py

from intent_router import route_intent
from handlers import music, alarm, gpt
from services.weather import get_weather

def handle_command(text: str) -> str:
    intent = route_intent(text)

    t = intent["type"]

    if t == "play_music":
        return music.play(intent["query"])

    if t == "pause_music":
        return music.pause()

    if t == "stop_music":
        return music.stop()

    if t == "set_alarm":
        return alarm.set_alarm(intent["text"])

    if t == "weather":
        return get_weather()

    # GPT fallback
    return gpt.ask_gpt(intent["text"])
