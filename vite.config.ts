import tailwindcss from "@tailwindcss/vite";
import { tanstackRouter } from "@tanstack/router-plugin/vite";
import react from "@vitejs/plugin-react";
import path from "node:path";
import { defineConfig } from "vite";
import { VitePWA, type VitePWAOptions } from "vite-plugin-pwa";

const ReactCompilerConfig = {
  target: "19",
};

const manifestOptions: VitePWAOptions["manifest"] = {
  name: "Tsuika",
  start_url: ".",
  short_name: "Tsuika",
  display: "standalone",
  background_color: "#fafafa",
  theme_color: "#fafafa",
  prefer_related_applications: false,
  icons: [
    {
      src: "icons/512.png",
      type: "image/png",
      sizes: "512x512",
    },
    {
      src: "icons/192.png",
      type: "image/png",
      sizes: "192x192",
    },
  ],
};

const pwaOptions: Partial<VitePWAOptions> = {
  registerType: "prompt",
  injectRegister: false,
  manifest: manifestOptions,

  workbox: {
    globPatterns: ["**/*.{js,css,html,svg,png,ico}"],
    cleanupOutdatedCaches: true,
    clientsClaim: true,
  },

  devOptions: {
    enabled: false,
    navigateFallback: "index.html",
    suppressWarnings: true,
    type: "module",
  },
};

// https://vite.dev/config/
export default defineConfig({
  server: {
    allowedHosts: ["app.tsuika.space"],
  },
  plugins: [
    tanstackRouter({ target: "react", autoCodeSplitting: true }),
    react({
      babel: {
        plugins: [["babel-plugin-react-compiler", ReactCompilerConfig]],
      },
    }),
    tailwindcss(),
    VitePWA(pwaOptions),
  ],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
});
