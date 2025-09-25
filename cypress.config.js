import { defineConfig } from "cypress";

export default defineConfig({
  e2e: {
    video: false,
    viewportWidth: 1280,
    viewportHeight: 720,
    setupNodeEvents(on, config) {
    
    },
  },
});