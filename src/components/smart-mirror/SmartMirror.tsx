import { useEffect, useState } from "react";

import TimeCard from "./TimeCard";
import WeatherCard from "./WeatherCard";
import ScheduleCard from "./ScheduleCard";
import MicGlow from "../MicGlow";
import YouTubePlayer from "../YouTubePlayer";
import AlarmOverlay from "../AlarmOverlay";
import PhotoQR from "../PhotoQR";

import { useLumiState } from "@/hooks/useLumiState";
import { useAlarmSound } from "@/hooks/useAlarmSound";
import { searchYouTube } from "@/utils/youtube";

const SmartMirror = () => {
  /* ---------------- Lumi State ---------------- */
  const lumiState = useLumiState();

  const listening = lumiState === "listening";
  const speaking = lumiState === "speaking";
  const thinking = lumiState === "thinking";

  /* ---------------- Music State ---------------- */
  const [videoId, setVideoId] = useState<string | null>(null);
  const [musicPlaying, setMusicPlaying] = useState(false);

  /* ---------------- Alarm State ---------------- */
  const [alarmTime, setAlarmTime] = useState<string>("No Alarms set");
  const [alarmRinging, setAlarmRinging] = useState(false);

    /* ---------------- Take Photo ---------------- */
  const [photoUrl, setPhotoUrl] = useState<string | null>(null);

useEffect(() => {
  const onPhotoReady = (e: Event) => {
    const ce = e as CustomEvent;
    setPhotoUrl(ce.detail);
  };

  window.addEventListener("lumi-photo-ready", onPhotoReady);
  return () => window.removeEventListener("lumi-photo-ready", onPhotoReady);
}, []);

useEffect(() => {
  if (!photoUrl) return;
  const t = setTimeout(() => setPhotoUrl(null), 30000);
  return () => clearTimeout(t);
}, [photoUrl]);


  /* 🔊 Alarm Sound */
  useAlarmSound(alarmRinging);


  /* ---------------- Listen to Alarm Events ---------------- */
  useEffect(() => {
    const onAlarmSet = (e: Event) => {
      const ce = e as CustomEvent;
      if (ce.detail) {
        setAlarmTime(ce.detail);
        setAlarmRinging(false);
      }
    };

    const onAlarmTriggered = () => {
      setAlarmTime("⏰ Alarm Ringing");
      setAlarmRinging(true);
    };

    const onAlarmStopped = () => {
      setAlarmRinging(false);
      setAlarmTime("No Alarms set");
    };

    window.addEventListener("lumi-alarm-set", onAlarmSet);
    window.addEventListener("lumi-alarm-triggered", onAlarmTriggered);
    window.addEventListener("lumi-alarm-stopped", onAlarmStopped);

    return () => {
      window.removeEventListener("lumi-alarm-set", onAlarmSet);
      window.removeEventListener("lumi-alarm-triggered", onAlarmTriggered);
      window.removeEventListener("lumi-alarm-stopped", onAlarmStopped);
    };
  }, []);

  /* ---------------- Listen to Lumi Actions ---------------- */
  useEffect(() => {
    const handler = async (e: Event) => {
      const ce = e as CustomEvent;
      const response = ce.detail;
      if (!response) return;

      if (response.action === "play_music") {
        const id = await searchYouTube(response.query);
        if (id) {
          setVideoId(id);
          setMusicPlaying(true);
        }
      }

      if (response.action === "pause_music") {
        setMusicPlaying(false);
      }

      if (response.action === "stop_music") {
        setMusicPlaying(false);
        setVideoId(null);
      }
    };

    window.addEventListener("lumi-response", handler);
    return () => window.removeEventListener("lumi-response", handler);
  }, []);

  /* ---------------- UI ---------------- */
  return (
    <div className="h-screen w-screen bg-background relative overflow-hidden flex flex-col">
      {/* Ambient Background */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute -top-32 -left-32 w-96 h-96 bg-primary/10 rounded-full blur-3xl" />
        <div className="absolute -top-32 -right-32 w-96 h-96 bg-primary/10 rounded-full blur-3xl" />
        <div className="absolute -bottom-32 left-1/2 -translate-x-1/2 w-[600px] h-48 bg-primary/20 rounded-full blur-3xl" />
        <div
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage: `
              linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px),
              linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)
            `,
            backgroundSize: "50px 50px",
          }}
        />
      </div>

      {/* Main Content */}
      <div className="relative z-10 flex-1 flex flex-col p-6 lg:p-10">
        {/* Top Row */}
        <div className="flex justify-between items-start">
          <div className="w-full max-w-sm">
            <TimeCard alarmTime={alarmTime} />
          </div>

          <div className="w-full max-w-sm">
            <WeatherCard />
          </div>
        </div>

        {/* 🎵 YouTube Player (Center) */}
        <YouTubePlayer videoId={videoId} playing={musicPlaying} />

        {/* Spacer */}
        <div className="flex-1" />

        {/* Bottom Row */}
        <div className="flex justify-between items-end relative">
          <div className="w-full max-w-xs">
            <ScheduleCard />
          </div>

          {/* 🎤 Mic */}
          <div className="absolute left-1/2 -translate-x-1/2 bottom-10 pointer-events-none">
            <MicGlow
              active={listening}
              speaking={speaking}
              thinking={thinking}
            />
          </div>

          <div className="w-full max-w-xs opacity-0 pointer-events-none">
            <div className="h-1" />
          </div>
        </div>
      </div>

      {/* 🚨 Alarm Overlay */}
      <AlarmOverlay active={alarmRinging} />

      <PhotoQR url={photoUrl} />

    </div>
  );
};

export default SmartMirror;
