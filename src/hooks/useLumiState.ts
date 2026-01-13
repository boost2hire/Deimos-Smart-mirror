import { useEffect, useRef, useState } from "react";

export type LumiState = "idle" | "listening" | "thinking" | "speaking";

export function useLumiState() {
  const [state, setState] = useState<LumiState>("idle");
  const wsRef = useRef<WebSocket | null>(null);

  useEffect(() => {
    console.log("[LUMI] hook mounted");

    // ❗ Prevent duplicate WS connections (React strict mode safe)
    if (wsRef.current) return;

    // 🌐 Backend base from env
    const BACKEND_BASE = import.meta.env.VITE_BACKEND_URL;

    if (!BACKEND_BASE) {
      console.error("[LUMI] VITE_BACKEND_URL is not defined");
      return;
    }

    // 🔁 http → ws | https → wss
    const WS_BASE = BACKEND_BASE.replace(/^http/, "ws");
    const WS_URL = `${WS_BASE}/ws/state`;

    console.log("[LUMI] Connecting WS:", WS_URL);

    const ws = new WebSocket(WS_URL);
    wsRef.current = ws;

    ws.onopen = () => {
      console.log("[LUMI] WS connected");
    };

    ws.onmessage = (event) => {
      try {
        if (typeof event.data !== "string") return;

        const data = JSON.parse(event.data);
        console.log("[LUMI] WS message:", data);

        // 🎤 STATE
      if (data.type === "state" && data.state === "idle") {
          setTimeout(() => setState("idle"), 300);
        } else if (data.type === "state") {
          setState(data.state as LumiState);
        }



        // 🗣 RESPONSE
        if (data.type === "response") {
          window.dispatchEvent(
            new CustomEvent("lumi-response", {
              detail: data.response,
            })
          );
        }

        // 🖼 PHOTO READY
        if (data.type === "photo_ready") {
          window.dispatchEvent(
            new CustomEvent("lumi-photo-ready", {
              detail: data.url,
            })
          );
        }

        // ⏰ ALARM SET
        if (data.type === "alarm_set") {
          window.dispatchEvent(
            new CustomEvent("lumi-alarm-set", {
              detail: data.time,
            })
          );
        }

        // 🚨 ALARM TRIGGERED
        if (data.type === "alarm_triggered") {
          window.dispatchEvent(
            new CustomEvent("lumi-alarm-triggered")
          );
        }
      } catch (e) {
        console.error("[LUMI] WS parse error", e);
      }
    };

    ws.onerror = (e) => {
      console.error("[LUMI] WS error", e);
    };

    ws.onclose = () => {
      console.warn("[LUMI] WS closed");
      wsRef.current = null;
    };

    return () => {
      console.log("[LUMI] hook unmounted");
      ws.close();
      wsRef.current = null;
    };
  }, []);

  return state;
}
