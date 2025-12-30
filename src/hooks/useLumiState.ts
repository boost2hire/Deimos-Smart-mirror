import { useEffect, useState } from "react";

export type LumiState = "idle" | "listening" | "thinking" | "speaking";

export interface LumiResponse {
  action?: "play_music" | "pause_music" | "stop_music";
  query?: string;
}

export function useLumiState() {
  const [state, setState] = useState<LumiState>("idle");

  useEffect(() => {
    console.log("[LUMI] hook mounted");

    const ws = new WebSocket("ws://127.0.0.1:8000/ws/state");

    ws.onopen = () => {
      console.log("[LUMI] WS connected");
    };

ws.onmessage = (event) => {
  try {
    // 🛡️ Ignore empty / invalid frames
    if (!event.data || typeof event.data !== "string") {
      return;
    }

    const trimmed = event.data.trim();
    if (!trimmed || trimmed[0] !== "{") {
      return;
    }

    const data = JSON.parse(trimmed);
    console.log("[LUMI] WS message:", data);

    if (data.state) {
      setState(data.state as LumiState);
    }

    if (data.response) {
      window.dispatchEvent(
        new CustomEvent("lumi-response", {
          detail: data.response,
        })
      );
    }
  } catch (e) {
    console.error("[LUMI] WS parse error", e, event.data);
  }
};



    ws.onerror = (e) => {
      console.error("[LUMI] WS error", e);
    };

    ws.onclose = () => {
      console.log("[LUMI] WS closed");
    };

    return () => {
      console.log("[LUMI] hook unmounted");
      ws.close();
    };
  }, []);

  return state;
}
