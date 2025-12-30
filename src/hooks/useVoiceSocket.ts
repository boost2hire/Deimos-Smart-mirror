// import { useEffect } from "react";

// interface VoiceResponse {
//   action?: "play_music" | "pause_music" | "stop_music";
//   query?: string;
// }

// export function useVoiceSocket(
//   onResponse: (response: VoiceResponse) => void
// ) {
//   useEffect(() => {
//     const ws = new WebSocket("ws://127.0.0.1:8000/ws/state");

//     ws.onmessage = (event) => {
//       try {
//         const data = JSON.parse(event.data);

//         if (data.response) {
//           onResponse(data.response);
//         }
//       } catch (e) {
//         console.error("[VOICE SOCKET] parse error", e);
//       }
//     };

//     return () => ws.close();
//   }, [onResponse]);
// }
