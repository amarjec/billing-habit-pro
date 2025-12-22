import { VitePWA } from "vite-plugin-pwa";
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
    VitePWA({
      registerType: "autoUpdate",
      injectRegister: false,

      manifest: {
        name: "Billing Habit",
        short_name: "Billing Habit",
        description: "Create professional quotes and track profits in seconds.",
        categories: ["business", "productivity", "utilities"],
        id: "/?source=pwa",
        start_url: "/",
        theme_color: "#133490",
        background_color: "#ffffff",
        display: "standalone",
        orientation: "portrait",

        // --- ENHANCED APP CAPABILITIES ---
        
        // Launch Handler: Prevents multiple app windows by focusing existing ones
        launch_handler: {
          client_mode: ["focus-existing", "auto"]
        },

        // --- ASSETS ---
        screenshots: [
          {
            src: "screenshots/login.png",
            sizes: "1080x2400",
            type: "image/png",
            form_factor: "narrow",
            label: "Professional Login with Cloud Sync",
          },
          {
            src: "screenshots/dashboard.png",
            sizes: "1080x2400",
            type: "image/png",
            form_factor: "narrow",
            label: "Intuitive Category Management",
          },
          {
            src: "screenshots/sub-category.png",
            sizes: "1080x2400",
            type: "image/png",
            form_factor: "narrow",
            label: "Industry-Specific Sub-Categories",
          },
          {
            src: "screenshots/quantity.png",
            sizes: "1080x2400",
            type: "image/png",
            form_factor: "narrow",
            label: "Fast Quantity & Rate Selection",
          },
          {
            src: "screenshots/quote.png",
            sizes: "1080x2400",
            type: "image/png",
            form_factor: "narrow",
            label: "Detailed Quotation Review",
          },
          {
            src: "screenshots/profit.png",
            sizes: "1080x2400",
            type: "image/png",
            form_factor: "narrow",
            label: "Real-time Net Profit Analysis",
          },
          {
            src: "screenshots/history.png",
            sizes: "1080x2400",
            type: "image/png",
            form_factor: "narrow",
            label: "Complete Order & Sales History",
          }
        ],

        icons: [
          { src: "icons/icon-48x48.png", sizes: "48x48", type: "image/png" },
          { src: "icons/icon-72x72.png", sizes: "72x72", type: "image/png" },
          { src: "icons/icon-96x96.png", sizes: "96x96", type: "image/png" },
          { src: "icons/icon-128x128.png", sizes: "128x128", type: "image/png" },
          { src: "icons/icon-144x144.png", sizes: "144x144", type: "image/png" },
          { src: "icons/icon-152x152.png", sizes: "152x152", type: "image/png" },
          { src: "icons/icon-192x192.png", sizes: "192x192", type: "image/png" },
          { src: "icons/icon-256x256.png", sizes: "256x256", type: "image/png" },
          { src: "icons/icon-384x384.png", sizes: "384x384", type: "image/png" },
          { src: "icons/icon-512x512.png", sizes: "512x512", type: "image/png" },
          {
            src: "maskable-icon-512x512.png",
            sizes: "512x512",
            type: "image/png",
            purpose: "maskable",
          },
        ],
      },

      // --- ADVANCED OFFLINE SUPPORT ---
      workbox: {
        globPatterns: ["**/*.{js,css,html,svg,png,ico,jpg}"],
        cleanupOutdatedCaches: true,
        clientsClaim: true,
        skipWaiting: true,
        // Runtime caching for API calls ensures offline support for user data
        runtimeCaching: [
          {
            urlPattern: /^https:\/\/your-api-domain\.com\/api\/.*/i,
            handler: 'NetworkFirst',
            options: {
              cacheName: 'api-data-cache',
              expiration: {
                maxEntries: 100,
                maxAgeSeconds: 60 * 60 * 24 * 30, // 30 Days
              },
              cacheableResponse: {
                statuses: [0, 200]
              }
            }
          }
        ]
      },

      devOptions: {
        enabled: true,
        navigateFallback: "index.html",
        suppressWarnings: true,
        type: "module",
      },
    }),
  ],
});