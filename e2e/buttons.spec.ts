import { test, expect, type ConsoleMessage, type Page } from "@playwright/test";

/**
 * Every user-facing route in the app. Keep in sync with src/routes/.
 */
const ROUTES = [
  "/",
  "/dashboard",
  "/journal",
  "/mind-map",
  "/timeline",
  "/vision-board",
  "/letters",
  "/capsule",
] as const;

/**
 * Attach console-error and pageerror listeners and return a getter for any
 * runtime errors captured during the test.
 */
function trackErrors(page: Page) {
  const errors: string[] = [];
  page.on("console", (msg: ConsoleMessage) => {
    if (msg.type() === "error") errors.push(`console.error: ${msg.text()}`);
  });
  page.on("pageerror", (err) => {
    errors.push(`pageerror: ${err.message}`);
  });
  return () => errors;
}

for (const route of ROUTES) {
  test(`route "${route}" renders without runtime errors`, async ({ page }) => {
    const getErrors = trackErrors(page);
    const response = await page.goto(route, { waitUntil: "networkidle" });
    expect(response?.ok(), `navigation to ${route} should succeed`).toBeTruthy();
    // Give any deferred/effect logging a beat to surface.
    await page.waitForTimeout(300);
    expect(getErrors(), `${route} should have no runtime errors on load`).toEqual([]);
  });

  test(`every button on "${route}" is clickable without runtime errors`, async ({ page }) => {
    const getErrors = trackErrors(page);
    await page.goto(route, { waitUntil: "networkidle" });

    // Count buttons live: some routes reveal extra buttons after a click.
    const seen = new Set<string>();
    let clicked = 0;

    // Loop a few passes so buttons that appear after other clicks are covered.
    for (let pass = 0; pass < 3; pass++) {
      const buttons = page.locator("button:visible:not([disabled])");
      const count = await buttons.count();
      for (let i = 0; i < count; i++) {
        const btn = buttons.nth(i);
        const key = ((await btn.getAttribute("aria-label")) ?? (await btn.innerText()) ?? "") + `#${i}`;
        if (seen.has(key)) continue;
        seen.add(key);
        try {
          await btn.click({ timeout: 1500, trial: false });
          clicked++;
        } catch {
          // Element may have detached/re-rendered; that's fine — keep going.
        }
      }
      await page.waitForTimeout(150);
    }

    expect(getErrors(), `${route} should have no runtime errors after clicks`).toEqual([]);
    // Sanity: home has no buttons, every other page should have at least one.
    if (route !== "/") {
      expect(clicked, `${route} should expose at least one clickable button`).toBeGreaterThan(0);
    }
  });
}
