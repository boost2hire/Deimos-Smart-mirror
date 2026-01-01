import { useEffect, useRef, useState } from "react";

export type LumiState = "idle" | "listening" | "thinking" | "speaking";

export function useLumiState() {
  const [state, setState] = useState<LumiState>("idle");
  const wsRef = useRef<WebSocket | null>(null);

  useEffect(() => {
    console.log("[LUMI] hook mounted");

    // ❗ Prevent duplicate WS connections
    if (wsRef.current) {
      return;
    }

    const ws = new WebSocket("ws://127.0.0.1:8000/ws/state");
    wsRef.current = ws;

    ws.onopen = () => {
      console.log("[LUMI] WS connected");
    };

   ws.onmessage = (event) => {
  try {
    if (typeof event.data !== "string") return;

    const data = JSON.parse(event.data);
    console.log("[LUMI] WS message:", data);

    // 🎤 STATE (support both formats)
    if (data.state) {
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

        if (data.type === "photo_ready") {
      window.dispatchEvent(
        new CustomEvent("lumi-photo-ready", { detail: data.url })
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

    return () => {
      console.log("[LUMI] hook unmounted");
      ws.close();
      wsRef.current = null;
    };
  }, []);

  return state;
}
