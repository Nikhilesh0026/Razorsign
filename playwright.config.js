// @ts-check
const { defineConfig, devices } = require('@playwright/test');
require('dotenv').config();



module.exports = defineConfig({
  testDir: './tests',
  timeout: 60 * 1000,
  expect: { timeout: 10 * 1000 },

  //fullyParallel: true,
  workers: Math.max(1, parseInt(process.env.WORKERS ?? '', 10) || 4),

  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 0 : 1,

  reporter: [['html', { open: 'never' }]],

  use: {
   // headless: process.env.HEADLESS !== 'false',
    //baseURL: 'https://demorazorsignapi.practiceleague.com',
    baseURL: 'https://demorazorsign.practiceleague.com/',
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
  },

  projects: [
    {name: 'setup', testMatch: /auth\.setup\.js/},
    { name: 'chromium', use: { ...devices['Desktop Chrome'] } ,
     dependencies: ['setup'],
  },

  ],
});