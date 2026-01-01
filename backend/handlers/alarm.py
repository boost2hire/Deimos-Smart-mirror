# backend/handlers/alarm.py

from datetime import datetime, timedelta
import re
import threading
import time
from typing import Callable, Optional

NotifyFn = Optional[Callable[[dict], None]]


class AlarmManager:
    def __init__(self):
        self.alarm_time: datetime | None = None
        self.active = False
        self.callback = None

    def set_alarm(self, alarm_time: datetime, on_trigger):
        self.alarm_time = alarm_time
        self.active = True
        self.callback = on_trigger

        threading.Thread(target=self._watch, daemon=True).start()

    def cancel_alarm(self):
        self.active = False
        self.alarm_time = None

    def _watch(self):
        while self.active and self.alarm_time:
            if datetime.now() >= self.alarm_time:
                self.active = False
                if self.callback:
                    self.callback()
                break
            time.sleep(1)


alarm_manager = AlarmManager()


def parse_alarm_time(text: str) -> datetime | None:
    text = text.lower()

    # 1️⃣ Handle compact times like 822 pm → 8:22 pm
    compact_match = re.search(r'\b(\d{3,4})\s*(am|pm)?\b', text)
    if compact_match:
        raw = compact_match.group(1)
        meridiem = compact_match.group(2)

        if len(raw) == 3:
            hour = int(raw[0])
            minute = int(raw[1:])
        else:
            hour = int(raw[:2])
            minute = int(raw[2:])
    else:
        # 2️⃣ Normal formats: 8, 8:30, 8.5, 8 pm
        match = re.search(r'(\d{1,2})(?:[:\.](\d{1,2}))?\s*(am|pm)?', text)
        if not match:
            return None

        hour = int(match.group(1))
        raw_minute = match.group(2)
        meridiem = match.group(3)

        if raw_minute:
            if len(raw_minute) == 1:  # ".5"
                minute = int(float("0." + raw_minute) * 60)
            else:
                minute = int(raw_minute)
        else:
            minute = 0

    # 3️⃣ AM / PM handling
    if meridiem == "pm" and hour < 12:
        hour += 12
    if meridiem == "am" and hour == 12:
        hour = 0

    # 4️⃣ Validate ranges
    if not (0 <= hour <= 23 and 0 <= minute <= 59):
        return None

    now = datetime.now()
    alarm_time = now.replace(hour=hour, minute=minute, second=0, microsecond=0)

    if alarm_time <= now:
        alarm_time += timedelta(days=1)

    return alarm_time


def handle_set_alarm(text: str, notify: NotifyFn = None) -> str:
    alarm_time = parse_alarm_time(text)

    if not alarm_time:
        return "Sorry, I couldn't understand the alarm time."

    def on_alarm_trigger():
        print("⏰ ALARM TRIGGERED")
        if notify:
            notify({"type": "alarm_triggered"})

    alarm_manager.set_alarm(alarm_time, on_alarm_trigger)

    # 🔔 Notify frontend
    if notify:
        notify({
            "type": "alarm_set",
            "time": alarm_time.strftime("%I:%M %p")
        })

    return f"Alarm set for {alarm_time.strftime('%I:%M %p')}"


def stop_alarm():
    alarm_manager.cancel_alarm()

    from ws import broadcaster
    broadcaster.broadcast_threadsafe({
        "type": "alarm_stopped"
    })

    return "Alarm stopped"
