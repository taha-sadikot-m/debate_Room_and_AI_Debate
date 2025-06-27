import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { componentTagger } from "lovable-tagger";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  server: {
    host: "::",
    port: 8080,
  },
  plugins: [
    react({
      // Ensure proper JSX runtime for both dev and production
      jsxRuntime: mode === 'production' ? 'automatic' : 'automatic',
      devTarget: 'es2020',
    }),
    // Only use component tagger in development
    ...(mode === 'development' ? [componentTagger()] : []),
  ],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  build: {
    target: 'es2020',
    minify: 'esbuild',
    sourcemap: false,
    outDir: 'dist',
    emptyOutDir: true,
    rollupOptions: {
      output: {
        manualChunks: undefined,
      },
    },
  },
  esbuild: {
    // Ensure proper JSX runtime
    jsx: 'automatic',
    jsxDev: mode === 'development',
  },
  define: {
    // Ensure proper environment variables
    'process.env.NODE_ENV': JSON.stringify(mode),
  },
}));
