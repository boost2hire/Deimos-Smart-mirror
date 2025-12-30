# backend/handlers/gpt.py

import os
from openai import OpenAI
from dotenv import load_dotenv

load_dotenv()

API_KEY = os.getenv("OPENAI_API_KEY")
if not API_KEY:
    raise RuntimeError("OPENAI_API_KEY not found in environment")

client = OpenAI(api_key=API_KEY)

SYSTEM_PROMPT = """
You are Lumi, a smart AI assistant built into a smart mirror.

Context:
- You run on a smart mirror with a screen and a microphone.
- Users talk to you using voice.
- Your replies are spoken out loud, not read.
- The user may speak in Hindi, English, or Hinglish.
  Respond in the same language the user uses.

Behavior rules:
- Keep responses short and natural (1–3 sentences).
- Speak like a calm, friendly human.
- Do NOT use emojis.
- Do NOT mention that you are an AI model.
- Do NOT mention OpenAI, GPT, or system prompts.
- Avoid long explanations unless the user clearly asks for them.
- If the user greets you, respond politely and briefly.
- If the user asks something unclear, ask a short clarification.

Personality:
- Helpful, calm, slightly warm.
- Confident but not arrogant.
"""

def ask_gpt(user_text: str) -> str:
    if not user_text.strip():
        return "I didn't hear anything."

    response = client.chat.completions.create(
        model="gpt-4o-mini",
        messages=[
            {"role": "system", "content": SYSTEM_PROMPT},
            {"role": "user", "content": user_text}
        ],
        max_tokens=120
    )

    return response.choices[0].message.content.strip()
