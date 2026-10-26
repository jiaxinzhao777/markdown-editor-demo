import { defineConfig, devices } from '@playwright/test';

const basePath = process.env.DEPLOY_BASE_PATH || '/markdown-editor-demo/';
const origin = 'http://127.0.0.1:4319';

export default defineConfig({
  testDir: './tests',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  workers: 2,
  timeout: 60_000,
  expect: { timeout: 20_000 },
  use: {
    baseURL: `${origin}${basePath}`,
    trace: 'retain-on-failure',
  },
  projects: [{
    name: 'chromium',
    use: { ...devices['Desktop Chrome'], channel: process.env.PLAYWRIGHT_CHANNEL },
  }],
  webServer: {
    command: 'npm run preview -- --port 4319',
    url: `${origin}${basePath}`,
    env: { DEPLOY_BASE_PATH: basePath },
    reuseExistingServer: false,
  },
});
