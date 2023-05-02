import { defineConfig } from 'cypress';
import vitePreprocessor from 'cypress-vite';
// eslint-disable-next-line @typescript-eslint/no-var-requires
const path = require('path');

// eslint-disable-next-line import/no-default-export
export default defineConfig({
  e2e: {
    baseUrl: 'http://frontend:3000',
    setupNodeEvents(on) {
      on('file:preprocessor', vitePreprocessor(path.resolve(__dirname, './vite.config.ts')));
    },
  },
});
