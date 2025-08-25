// vite.config.js
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  test: {
    environment: "jsdom",
    setupFiles: "./src/test/setupTests.js",
    globals: true,
  },
  server: {
    proxy: {
      "/api": {
        target: "http://localhost:3000", // backend
        changeOrigin: true,
        cookieDomainRewrite: "localhost",
      },
    },
  },
});
