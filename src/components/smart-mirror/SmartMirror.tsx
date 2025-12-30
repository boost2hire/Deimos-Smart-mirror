import { useEffect, useState } from "react";

import TimeCard from "./TimeCard";
import WeatherCard from "./WeatherCard";
import ScheduleCard from "./ScheduleCard";
import MicGlow from "../MicGlow";
import YouTubePlayer from "../YouTubePlayer";

import { useLumiState } from "@/hooks/useLumiState";
import { searchYouTube } from "@/utils/youtube";

const SmartMirror = () => {
  /* ---------------- Lumi State ---------------- */
  const lumiState = useLumiState();
  // window.addEventListener("lumi-response", handler);


  const listening = lumiState === "listening";
  const speaking = lumiState === "speaking";
  const thinking = lumiState === "thinking";

  /* ---------------- Music State ---------------- */
  const [videoId, setVideoId] = useState<string | null>(null);
  const [musicPlaying, setMusicPlaying] = useState(false);

  /* ---------------- Listen to Lumi Actions ---------------- */
  useEffect(() => {
    const handler = async (e: Event) => {
      const customEvent = e as CustomEvent;
      const response = customEvent.detail;

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
            <TimeCard alarmTime="No Alarms set" />
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
    </div>
  );
};

export default SmartMirror;
