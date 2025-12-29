import re

def set_alarm(text):
    match = re.search(r"(\d{1,2})(:\d{2})?\s?(am|pm)?", text)
    if not match:
        return "I couldn't understand the alarm time."

    time = match.group()
    return f"Alarm set for {time}"
