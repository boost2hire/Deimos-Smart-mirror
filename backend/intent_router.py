def route_intent(text: str):
    t = text.lower().strip()

    # 🎵 Music
    if t.startswith("play "):
        return {"type": "play_music", "query": t.replace("play ", "")}

    if "pause music" in t or t == "pause":
        return {"type": "pause_music"}

    if "stop music" in t:
        return {"type": "stop_music"}

    # ⏰ Alarm
    if "set alarm" in t:
        return {"type": "set_alarm", "text": t}

    # 🌤 Weather
    if "weather" in t:
        return {"type": "weather"}

    # 📅 Events
    if "today" in t or "schedule" in t:
        return {"type": "events"}

    # 🤖 Fallback
    return {"type": "gpt", "text": text}
