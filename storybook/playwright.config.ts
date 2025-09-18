import { defineConfig } from "@playwright/test";

export default defineConfig({
  testDir: "./tests",
  snapshotPathTemplate: "{testDir}/__snapshots__/{testFilePath}/{arg}{ext}",
  fullyParallel: true,
  reporter: "html",
  use: {
    baseURL: "http://localhost:6006",
    browserName: "chromium",
  },
  webServer: {
    command: "serve ../build/storybook -p 6006",
    url: "http://localhost:6006",
    reuseExistingServer: !process.env.CI,
    timeout: 120 * 1000,
  },
});
