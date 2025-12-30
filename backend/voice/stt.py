# voice/stt.py

import sounddevice as sd
import wave
import subprocess
import os

# 🔧 PATHS (keep absolute & stable)
WHISPER_BIN = r"C:\Users\DELL\Desktop\orbis\voice\lumiVoice\whisper\Release\whisper-cli.exe"
MODEL = r"C:\Users\DELL\Desktop\orbis\voice\lumiVoice\models\ggml-tiny.en.bin"

AUDIO_FILE = "command.wav"


def record_command(seconds: int = 4):
    """
    Records audio from microphone and saves to command.wav
    """
    fs = 16000
    print("🎙 Recording command...")

    audio = sd.rec(
        int(seconds * fs),
        samplerate=fs,
        channels=1,
        dtype="int16"
    )
    sd.wait()

    with wave.open(AUDIO_FILE, "wb") as wf:
        wf.setnchannels(1)
        wf.setsampwidth(2)
        wf.setframerate(fs)
        wf.writeframes(audio.tobytes())


def speech_to_text() -> str:
    """
    Runs Whisper CLI on recorded audio and returns transcribed text
    """
    if not os.path.exists(AUDIO_FILE):
        return ""

    cmd = [
        WHISPER_BIN,
        "-m", MODEL,
        "-f", AUDIO_FILE,
        "-nt",
        "-np",
        "-l", "en"
    ]

    result = subprocess.run(cmd, capture_output=True, text=True)

    text = " ".join(result.stdout.strip().splitlines()).lower()
    print("📝 Transcribed:", text)

    return text
