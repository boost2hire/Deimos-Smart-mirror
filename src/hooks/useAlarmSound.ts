
import { useEffect, useRef } from "react";

export function useAlarmSound(ringing: boolean) {
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    if (!audioRef.current) {
      audioRef.current = new Audio("/sounds/alarm.mp3");
      audioRef.current.loop = true;
    }

    if (ringing) {
      audioRef.current.play().catch(() => {});
    } else {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
    }

    return () => {
      audioRef.current?.pause();
    };
  }, [ringing]);
}
