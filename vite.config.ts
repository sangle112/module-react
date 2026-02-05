import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";
import tailwindcss from "@tailwindcss/vite";

export default defineConfig({
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "src"),
    },
  },
  server: {
    proxy: {
      "/api": {
        target: "https://instagram.f8team.dev",
        changeOrigin: true,
        secure: true,
      },
      "/uploads": {
        target: "https://instagram.f8team.dev",
        changeOrigin: true,
        secure: true,
      },
      "/socket.io": {
        target: "https://instagram.f8team.dev",
        ws: true,
        changeOrigin: true,
        secure: true,
      },
    },
  },
});
