import pyttsx3

def speak(text: str):
    if not text or not text.strip():
        return

    try:
        engine = pyttsx3.init()
        engine.setProperty("rate", 170)
        engine.setProperty("volume", 1.0)

        voices = engine.getProperty("voices")
        engine.setProperty("voice", voices[0].id)

        print("🗣️ Speaking:", text)
        engine.say(text)
        engine.runAndWait()
        engine.stop()

        del engine  # IMPORTANT: force cleanup

    except Exception as e:
        print("TTS ERROR:", e)
