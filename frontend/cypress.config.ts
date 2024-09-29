import { defineConfig } from 'cypress';
import vitePreprocessor from 'cypress-vite';
const path = require('path');

export default defineConfig({
  e2e: {
    baseUrl: 'http://localhost:3000',
    setupNodeEvents(on) {
      on('file:preprocessor', vitePreprocessor(path.resolve(__dirname, './vite.config.ts')));
    },
  },
});
