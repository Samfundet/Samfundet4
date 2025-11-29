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
  resolve: {
    alias: [
      {
        find: '~',
        replacement: path.resolve(__dirname, './src'),
      },
    ],
  },
});
