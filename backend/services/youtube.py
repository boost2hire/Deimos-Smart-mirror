import yt_dlp

def search_youtube(query: str) -> str | None:
    with yt_dlp.YoutubeDL({"quiet": True}) as ydl:
        info = ydl.extract_info(f"ytsearch1:{query}", download=False)
        if "entries" in info and info["entries"]:
            return info["entries"][0]["id"]
    return None
