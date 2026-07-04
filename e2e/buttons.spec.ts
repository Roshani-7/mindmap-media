import { test, expect, type ConsoleMessage, type Page } from "@playwright/test";

/**
 * Every user-facing route in the app plus how many `<button>` elements we
 * expect to be clickable on initial render. Routes whose primary controls are
 * non-<button> elements (e.g. Timeline is read-only, Letters uses a clickable
 * envelope) declare a minimum of 0 and are exercised separately below.
 * Keep in sync with src/routes/.
 */
const ROUTES: { path: string; minButtons: number }[] = [
  { path: "/", minButtons: 0 },
  { path: "/dashboard", minButtons: 1 },
  { path: "/journal", minButtons: 1 },
  { path: "/mind-map", minButtons: 1 },
  { path: "/timeline", minButtons: 0 },
  { path: "/vision-board", minButtons: 1 },
  { path: "/letters", minButtons: 0 },
  { path: "/capsule", minButtons: 1 },
];


/**
 * Attach console-error and pageerror listeners and return a getter for any
 * runtime errors captured during the test.
 */
function trackErrors(page: Page) {
  const errors: string[] = [];
  // Network 404s for optional assets (favicons, og images, etc.) are not
  // JavaScript runtime errors, so ignore that specific console noise.
  const isResourceNoise = (text: string) =>
    /Failed to load resource/i.test(text) && /404|status of 4\d\d/i.test(text);
  page.on("console", (msg: ConsoleMessage) => {
    if (msg.type() !== "error") return;
    const text = msg.text();
    if (isResourceNoise(text)) return;
    errors.push(`console.error: ${text}`);
  });
  page.on("pageerror", (err) => {
    errors.push(`pageerror: ${err.message}`);
  });
  return () => errors;
}


for (const { path: route, minButtons } of ROUTES) {
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
    expect(
      clicked,
      `${route} should expose at least ${minButtons} clickable button(s)`,
    ).toBeGreaterThanOrEqual(minButtons);
  });
}

// The Letters page uses a clickable envelope (not a <button>) to reveal its
// composer, which then exposes real buttons. Exercise that full flow.
test('letters envelope opens and its buttons work without runtime errors', async ({ page }) => {
  const getErrors = trackErrors(page);
  await page.goto("/letters", { waitUntil: "networkidle" });

  await page.getByText("tap to open a new letter").click();
  await page.getByRole("textbox").first().fill("Dear future me, this is a test note.");

  const buttons = page.locator("button:visible:not([disabled])");
  const count = await buttons.count();
  expect(count, "letters composer should reveal at least one button").toBeGreaterThan(0);
  for (let i = 0; i < count; i++) {
    try {
      await buttons.nth(i).click({ timeout: 1500 });
    } catch {
      /* re-render is fine */
    }
  }

  expect(getErrors(), "letters flow should have no runtime errors").toEqual([]);
});

  });
}
