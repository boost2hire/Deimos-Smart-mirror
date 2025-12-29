import pvporcupine
import sounddevice as sd
import struct
import time


def wait_for_wake_word(access_key: str, keyword: str):
    porcupine = pvporcupine.create(
        access_key=access_key,
        keyword_paths=[keyword]
    )

    detected = False

    def callback(indata, frames, time_info, status):
        nonlocal detected
        pcm = struct.unpack_from(
            "h" * porcupine.frame_length, indata
        )
        if porcupine.process(pcm) >= 0:
            detected = True
            raise sd.CallbackStop()

    with sd.RawInputStream(
        samplerate=porcupine.sample_rate,
        blocksize=porcupine.frame_length,
        dtype="int16",
        channels=1,
        callback=callback,
    ):
        while not detected:
            time.sleep(0.05)

    porcupine.delete()
