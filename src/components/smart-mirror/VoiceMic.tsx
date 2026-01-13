import { useState, useEffect, useCallback } from "react";
import { Mic, MicOff } from "lucide-react";

interface VoiceMicProps {
  wakeWord?: string;
  onWakeWordDetected?: () => void;
  onListeningEnd?: () => void;
}

const VoiceMic = ({
  wakeWord = "hey lumi",
  onWakeWordDetected,
  onListeningEnd,
}: VoiceMicProps) => {
  const [isListening, setIsListening] = useState(false);
  const [isActive, setIsActive] = useState(false);
  const [status, setStatus] = useState<"idle" | "listening" | "processing">("idle");

  // Simulated wake word detection for demo
  // In production, this would use Web Speech API
  const simulateWakeWord = useCallback(() => {
    if (!isActive) {
      setIsActive(true);
      setIsListening(true);
      setStatus("listening"); 
      onWakeWordDetected?.();

      // Auto-stop after 5 seconds for demo
      setTimeout(() => {
        setIsListening(false);
        setStatus("processing");
        setTimeout(() => {
          setIsActive(false);
          setStatus("idle");
          onListeningEnd?.();
        }, 1000);
      }, 5000);
    }
  }, [isActive, onWakeWordDetected, onListeningEnd]);

  const handleClick = () => {
    if (status === "idle") {
      simulateWakeWord();
    } else if (status === "listening") {
      setIsListening(false);
      setStatus("processing");
      setTimeout(() => {
        setIsActive(false);
        setStatus("idle");
        onListeningEnd?.();
      }, 1000);
    }
  };

  return (
    <div className="flex flex-col items-center gap-4 animate-fade-in-up" style={{ animationDelay: "0.4s" }}>
      {/* Status Text */}
      <div className="h-6 flex items-center justify-center">
        {status === "idle" && (
          <p className="text-sm text-muted-foreground">Say "{wakeWord}" to start</p>
        )}
        {status === "listening" && (
          <p className="text-sm text-primary animate-pulse">Listening...</p>
        )}
        {status === "processing" && (
          <p className="text-sm text-muted-foreground">Processing...</p>
        )}
      </div>

      {/* Mic Button Container */}
      <div className="relative">
        {/* Expanding Ring Animation (when listening) */}
        {isListening && (
          <>
            <div className="absolute inset-0 rounded-full bg-primary/20 animate-ring-expand" />
            <div 
              className="absolute inset-0 rounded-full bg-primary/10 animate-ring-expand" 
              style={{ animationDelay: "0.5s" }} 
            />
          </>
        )}

        {/* Glow Effect */}
        {isActive && (
          <div className="absolute -inset-4 rounded-full bg-primary/20 blur-xl animate-pulse-glow" />
        )}

        {/* Main Mic Button */}
        <button
          onClick={handleClick}
          className={`
            relative z-10 w-16 h-16 rounded-full flex items-center justify-center
            backdrop-blur-xl border transition-all duration-500 ease-out
            ${isActive 
              ? "bg-primary/20 border-primary shadow-glow-lg scale-110" 
              : "bg-white/10 border-white/20 hover:bg-white/15 hover:border-white/30"
            }
            ${isListening ? "animate-mic-pulse" : ""}
          `}
        >
          {isActive ? (
            <Mic className="w-7 h-7 text-primary" />
          ) : (
            <Mic className="w-7 h-7 text-muted-foreground group-hover:text-foreground transition-colors" />
          )}
        </button>

        {/* Inner Glow Ring (when active) */}
        {isActive && (
          <div className="absolute inset-0 rounded-full ring-2 ring-primary/50 animate-pulse" />
        )}
      </div>

      {/* Assistant Name */}
      <p className="text-gradient text-lg font-medium mt-2">Lumi</p>
    </div>
  );
};

export default VoiceMic;
