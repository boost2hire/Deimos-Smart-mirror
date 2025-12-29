import os
import requests
from dotenv import load_dotenv
from pathlib import Path

# 🔥 FORCE correct .env path
ENV_PATH = Path(__file__).resolve().parents[1] / ".env"
load_dotenv(dotenv_path=ENV_PATH)

API_KEY = os.getenv("OPENWEATHER_API_KEY")
CITY = os.getenv("CITY", "Chandigarh")

print("🌦 WEATHER ENV PATH:", ENV_PATH)
print("🌦 API KEY RAW:", repr(API_KEY))

def get_weather():
    if not API_KEY:
        raise RuntimeError("OPENWEATHER_API_KEY not loaded")

    url = "https://api.openweathermap.org/data/2.5/weather"
    params = {
        "q": CITY,
        "appid": API_KEY,
        "units": "metric",
    }

    res = requests.get(url, params=params, timeout=5)
    res.raise_for_status()
    data = res.json()

    return {
        "location": data["name"],
        "temperature": round(data["main"]["temp"]),
        "feelsLike": round(data["main"]["feels_like"]),
        "humidity": data["main"]["humidity"],
        "windSpeed": round(data["wind"]["speed"], 2),
        "condition": data["weather"][0]["main"],
        "description": data["weather"][0]["description"],
        "forecast": [
            {"day": "Sun", "min": 15, "max": 23, "icon": "Sun"},
            {"day": "Mon", "min": 15, "max": 24, "icon": "CloudSun"},
            {"day": "Tue", "min": 15, "max": 25, "icon": "Cloud"},
            {"day": "Wed", "min": 16, "max": 25, "icon": "CloudRain"},
        ]
    }
