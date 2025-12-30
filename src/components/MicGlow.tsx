import { Mic } from "lucide-react";

interface MicGlowProps {
  active?: boolean;
  speaking?: boolean;
  thinking?: boolean;
}

export default function MicGlow({ active, speaking, thinking }: MicGlowProps) {
  return (
    <div className="relative flex flex-col items-center justify-center">
      {/* LISTENING / SPEAKING WAVES */}
      {(active || speaking) && !thinking && (
        <>
          <span className={`mic-wave ${speaking ? "fast" : ""}`} />
          <span className={`mic-wave delay ${speaking ? "fast" : ""}`} />
        </>
      )}

      {/* THINKING BARS */}
      {thinking && (
        <div className="thinking-bars">
          <span />
          <span />
          <span />
        </div>
      )}

      {/* MIC ICON */}
      <div
        className={`
          mic-icon-wrapper
          ${active ? "listening" : ""}
          ${speaking ? "speaking" : ""}
          ${thinking ? "thinking" : ""}
        `}
      >
        <Mic className="w-8 h-8 text-white" strokeWidth={1.8} />
      </div>

      <span className="mt-3 text-xs tracking-widest text-muted-foreground uppercase">
        {speaking ? "speaking" : thinking ? "thinking" : active ? "listening" : "idle"}
      </span>
    </div>
  );
}
