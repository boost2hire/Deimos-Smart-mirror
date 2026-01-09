export const API_BASE =
  import.meta.env.VITE_API_BASE || "https://api.refboosts.com";

export const WS_BASE =
  API_BASE.replace("https://", "wss://").replace("http://", "ws://");
