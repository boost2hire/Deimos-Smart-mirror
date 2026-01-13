import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { componentTagger } from "lovable-tagger";

export default defineConfig(({ mode }) => ({
  server: {
    host: "0.0.0.0",
    port: 8080,
    allowedHosts: [
      ".ngrok-free.dev",
      "localhost",
      "127.0.0.1",
    ],

    proxy: {
      // ✅ AUTH APIs
      "/auth": {
        target: "http://127.0.0.1:8000",
        changeOrigin: true,
      },

      // ✅ ONLY gallery *API*, not gallery *pages*
      "/gallery/session": {
        target: "http://127.0.0.1:8000",
        changeOrigin: true,
      },

      // ✅ other APIs
      "/api": {
        target: "http://127.0.0.1:8000",
        changeOrigin: true,
      },
    },
  },

  plugins: [
    react(),
    mode === "development" && componentTagger(),
  ].filter(Boolean),

  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
}));
