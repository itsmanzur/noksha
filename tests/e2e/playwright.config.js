// Real-browser checks. Needs a running Local site and the fixture:
//   NK_E2E_OUT=fixture.json wp eval-file wp-content/plugins/noksha/tests/e2e/fixture.php
//   NK_E2E_FIXTURE=fixture.json npx playwright test
// Set NK_E2E_PORT to the site's nginx port (Local shows it) when the host name
// does not resolve on this machine; the browser then maps the host to it.
const { defineConfig } = require('@playwright/test');

const host = process.env.NK_E2E_HOST || 'test.local';
const port = process.env.NK_E2E_PORT || '';
const args = port ? [`--host-resolver-rules=MAP ${host} 127.0.0.1:${port}`] : [];

module.exports = defineConfig({
  testDir: '.',
  testMatch: '*.spec.js',
  timeout: 60000,
  workers: 1,
  retries: 0,
  reporter: [['list']],
  use: {
    baseURL: `http://${host}`,
    launchOptions: { args },
    screenshot: 'only-on-failure',
    viewport: { width: 1280, height: 900 },
  },
  outputDir: process.env.NK_E2E_ARTIFACTS || 'test-results',
});
