# voice/beep.py

import winsound

def play_beep():
    # frequency (Hz), duration (ms)
    winsound.Beep(750, 120)
