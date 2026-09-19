import { defineConfig } from "@playwright/test";

const PORT = 4321;

export default defineConfig({
  testDir: "tests",
  forbidOnly: true,
  use: { baseURL: `http://localhost:${String(PORT)}` },
  webServer: {
    command: `npm run preview -- --port ${String(PORT)}`,
    url: `http://localhost:${String(PORT)}`,
  },
});
