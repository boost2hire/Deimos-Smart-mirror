import YouTube from "react-youtube";
import { useEffect, useRef } from "react";

interface Props {
  videoId: string | null;
  playing: boolean;
}

export default function YouTubePlayer({ videoId, playing }: Props) {
  const playerRef = useRef<YT.Player | null>(null);

  useEffect(() => {
    if (!playerRef.current) return;

    if (playing) {
      playerRef.current.playVideo();
    } else {
      playerRef.current.pauseVideo();
    }
  }, [playing]);

  if (!videoId) return null;

  return (
    <div className="absolute inset-0 z-20 flex items-center justify-center pointer-events-none">
      {/* 🎵 Music Card */}
      <div className="w-[40%] max-w-4xl aspect-video rounded-2xl overflow-hidden bg-black/70 backdrop-blur shadow-2xl pointer-events-auto">
        <YouTube
          videoId={videoId}
          className="w-full h-full"
          iframeClassName="w-full h-full"
          opts={{
            width: "100%",
            height: "100%",
            playerVars: {
              autoplay: 1,
              controls: 0,
              modestbranding: 1,
              rel: 0,
            },
          }}
          onReady={(e) => {
            playerRef.current = e.target;
          }}
        />
      </div>
    </div>
  );
}
