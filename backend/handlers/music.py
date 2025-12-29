def play(query: str):
    # backend does NOT play music
    # it only tells frontend WHAT to play
    return {
        "action": "play_music",
        "query": query
    }

def pause():
    return { "action": "pause_music" }

def stop():
    return { "action": "stop_music" }
