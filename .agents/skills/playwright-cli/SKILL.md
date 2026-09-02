---
name: playwright-cli
description: >-
  Playwright CLI & Browser Automation skill for E2E testing, visual regression testing, accessibility snapshots, page interaction, and UI auditing. Use when asked to "run Playwright tests", "test with Playwright", "capture page screenshot", "audit UI with Playwright", or "run browser automation".
---

# Playwright CLI & Automation Skill

This skill provides step-by-step instructions and patterns for executing browser automation, running end-to-end (E2E) tests, visual snapshot testing, and accessibility checks using Playwright CLI and Playwright MCP.

---

## 1. Quick Reference & Commands

### 1.A Running Playwright CLI Commands
```bash
# Run all end-to-end tests
cmd /c npx playwright test

# Run tests in UI mode / interactive mode
cmd /c npx playwright test --ui

# Run tests on specific browser (chromium, firefox, webkit)
cmd /c npx playwright test --project=chromium

# Generate Playwright tests by recording browser actions
cmd /c npx playwright codegen https://localhost:3000

# View HTML test report
cmd /c npx playwright show-report
```

---

## 2. Playwright MCP Integration

When Playwright MCP is connected (`@playwright/mcp`), the agent gains live browser control tools:
- `browser_navigate`: Navigate browser to target URL.
- `browser_click`: Click element by accessibility selector or text.
- `browser_type`: Fill input fields and trigger keyboard events.
- `browser_take_screenshot`: Capture full-page or element visual screenshot.
- `browser_get_accessibility_tree`: Fetch structured accessibility snapshot.
- `browser_evaluate`: Run inline JavaScript in browser context.

---

## 3. Best Practices for Test Writing & Visual Audits

1. **User-Visible Locators**: Always prefer `getByRole`, `getByText`, `getByLabel`, or `getByTestId` over brittle CSS/XPath selectors.
   ```ts
   // Good
   await page.getByRole('button', { name: 'Submit' }).click();
   // Bad
   await page.click('div > form > button.btn-primary');
   ```

2. **Visual Regression Snapshots**:
   ```ts
   import { test, expect } from '@playwright/test';

   test('homepage visual snapshot match', async ({ page }) => {
     await page.goto('/');
     await expect(page).toHaveScreenshot('homepage.png', {
       maxDiffPixelRatio: 0.01,
     });
   });
   ```

3. **Accessibility Validation**:
   Integrate `@axe-core/playwright` to automatically scan rendered DOM tree for WCAG compliance.

---

## 4. Troubleshooting & CI Execution

- **Install Playwright Browsers**: If browser binaries are missing, execute:
  `cmd /c npx playwright install --with-deps`
- **Headless vs Headful**: In automated/CI environments, run `--headed` mode only when visual debugging is required.
