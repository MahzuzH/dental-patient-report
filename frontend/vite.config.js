import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";

// https://vite.dev/config/
export default defineConfig({
    plugins: [
        react(),
        // Custom plugin for preload/prefetch to fulfill requirements
        {
            name: 'vite-plugin-preload-prefetch',
            transformIndexHtml(html, { chunk }) {
                // Injects preload for critical assets and prefetch for likely chunks
                return html.replace(
                    '</head>',
                    `
    <!-- Preload Critical Fonts/Assets -->
    <link rel="preload" href="https://fonts.googleapis.com/css2?family=Montserrat:wght@400;600;700;800&family=Open+Sans:wght@400;500;600;700&family=Roboto:wght@400;500;700&display=swap" as="style" />
    <!-- Prefetch Likely Pages (hints to browser) -->
    <meta http-equiv="x-dns-prefetch-control" content="on">
    <link rel="dns-prefetch" href="http://localhost:8080">
  </head>`
                );
            }
        }
    ],
    resolve: {
        alias: {
            "@": path.resolve(__dirname, "./src"),
        },
    },
    server: {
        proxy: {
            "/api": "http://localhost:8080",
            "/uploads": "http://localhost:8080",
        },
    },
    build: {
        minify: true,
        chunkSizeWarningLimit: 1000,
        modulePreload: {
            polyfill: true
        },
        rollupOptions: {
            output: {
                manualChunks(id) {
                    if (id.includes('node_modules')) {
                        if (id.includes('react') || id.includes('react-dom') || id.includes('react-router')) {
                            return 'vendor-react';
                        }
                        if (id.includes('recharts')) {
                            return 'vendor-recharts';
                        }
                        if (id.includes('lucide-react') || id.includes('framer-motion')) {
                            return 'vendor-ui';
                        }
                        return 'vendor'; // Other dependencies
                    }
                }
            }
        }
    }
});
