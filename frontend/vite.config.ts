import react from "@vitejs/plugin-react-swc";
import { defineConfig } from 'vite';
import svgr from 'vite-plugin-svgr';
import * as path from 'path';
import { fileURLToPath } from 'node:url';
import autoprefixer from "autoprefixer";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react(),
    svgr(),
  ],
  css: {
    preprocessorOptions: {
      scss: {
        loadPaths: ['.']
      }
    },
    postcss: {
      plugins: [
        // @ts-ignore it works.
        autoprefixer({}),
      ]
    }
  },
  build: {
    // Must match STATIC_URL in backend/root/settings/base.py. Not 'assets', which Samf3 uses on www.samfundet.no
    assetsDir: 'static',
  },
  resolve: {
    alias: [
      {
        find: '~',
        replacement: path.resolve(__dirname, './src'),
      },
    ],
  },
});
