const fs = require('fs');
const path = require('path');

const RESULTS_DIR = path.resolve(__dirname, '..', 'test-results');

function ensureDir(dir) {
  fs.mkdirSync(dir, { recursive: true });
  return dir;
}

/** Make a file-safe name from free text, e.g. "Create request (branch)" -> "Create_request_branch". */
function safeName(text) {
  return String(text)
    .replace(/[^a-zA-Z0-9-_]+/g, '_')
    .replace(/^_+|_+$/g, '')
    .slice(0, 80);
}

/**
 * Full-page screenshot with a clear file name.
 * @param {import('@playwright/test').Page} page
 * @param {string} name
 * @returns {Promise<string>} absolute path of the saved file
 */
async function takeScreenshot(page, name) {
  const dir = ensureDir(path.join(RESULTS_DIR, 'screenshots'));
  const file = path.join(dir, `${safeName(name)}_${Date.now()}.png`);
  await page.screenshot({ path: file, fullPage: true });
  return file;
}

/**
 * Screenshot of a single element, e.g. a validation message or a table.
 * @param {import('@playwright/test').Locator} locator
 * @param {string} name
 */
async function takeElementScreenshot(locator, name) {
  const dir = ensureDir(path.join(RESULTS_DIR, 'screenshots'));
  const file = path.join(dir, `${safeName(name)}_element_${Date.now()}.png`);
  await locator.screenshot({ path: file });
  return file;
}

/**
 * Attach a screenshot to the Playwright HTML report for the current test.
 * @param {import('@playwright/test').Page} page
 * @param {import('@playwright/test').TestInfo} testInfo
 * @param {string} [label='screenshot']
 */
async function attachScreenshot(page, testInfo, label = 'screenshot') {
  const body = await page.screenshot({ fullPage: true });
  await testInfo.attach(label, { body, contentType: 'image/png' });
}

/**
 * Start a trace with screenshots and snapshots, for steps you want recorded
 * even when the test passes.
 * @param {import('@playwright/test').BrowserContext} context
 */
async function startTrace(context) {
  await context.tracing.start({ screenshots: true, snapshots: true, sources: true });
}

/**
 * Stop the trace and save it to test-results/traces.
 * Open it later with: npx playwright show-trace <file>
 * @param {import('@playwright/test').BrowserContext} context
 * @param {string} name
 * @returns {Promise<string>} absolute path of the saved trace
 */
async function stopTrace(context, name) {
  const dir = ensureDir(path.join(RESULTS_DIR, 'traces'));
  const file = path.join(dir, `${safeName(name)}_${Date.now()}.zip`);
  await context.tracing.stop({ path: file });
  return file;
}

/**
 * Collect browser console errors during a test.
 * Call once in beforeEach; read the list in afterEach or before assertions.
 * @param {import('@playwright/test').Page} page
 * @returns {string[]} array that fills as errors happen
 */
function collectConsoleErrors(page) {
  const errors = [];
  page.on('console', (msg) => {
    if (msg.type() === 'error') errors.push(msg.text());
  });
  page.on('pageerror', (err) => errors.push(`pageerror: ${err.message}`));
  return errors;
}

/**
 * Save a text file (e.g. console errors, API responses) next to the other artifacts.
 * @param {string} name
 * @param {string} content
 */
function saveTextArtifact(name, content) {
  const dir = ensureDir(path.join(RESULTS_DIR, 'artifacts'));
  const file = path.join(dir, `${safeName(name)}_${Date.now()}.txt`);
  fs.writeFileSync(file, content, 'utf-8');
  return file;
}

/**
 * Use in afterEach: if the test failed, save a screenshot and the trace.
 * Playwright already does this via playwright.config.js (screenshot, trace:
 * 'retain-on-failure'), so use this when you want a named extra copy.
 * @param {import('@playwright/test').Page} page
 * @param {import('@playwright/test').TestInfo} testInfo
 */
async function captureOnFailure(page, testInfo) {
  if (testInfo.status === testInfo.expectedStatus) return;
  const name = `FAILED_${testInfo.title}_${testInfo.project.name}`;
  const file = await takeScreenshot(page, name);
  await testInfo.attach('failure-screenshot', { path: file, contentType: 'image/png' });
}

module.exports = {
  takeScreenshot,
  takeElementScreenshot,
  attachScreenshot,
  startTrace,
  stopTrace,
  collectConsoleErrors,
  saveTextArtifact,
  captureOnFailure,
};