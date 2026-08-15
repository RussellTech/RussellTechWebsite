import path from "node:path";
import { pathToFileURL } from "node:url";
import { chromium } from "playwright";

const brandDirectory = path.resolve("public/brand");
const browser = await chromium.launch({ headless: true });

for (const [family, theme] of [
  ["refractive", "dark"],
  ["refractive", "light"],
  ["behind", "dark"],
  ["behind", "light"],
  ["dark-rt", "dark"],
  ["dark-rt", "light"],
  ["multi-refraction", "dark"],
  ["multi-refraction", "light"],
  ["quad-refraction", "dark"],
  ["quad-refraction", "light"],
]) {
  const context = await browser.newContext({
    viewport: { width: 720, height: 190 },
    deviceScaleFactor: 2.5,
  });
  const page = await context.newPage();
  await page.goto(
    pathToFileURL(
      path.join(brandDirectory, `russelltech-${family}-glass-horizontal-${theme}.svg`),
    ).href,
  );
  await page.waitForTimeout(250);
  await page.screenshot({
    path: path.join(
      brandDirectory,
      `russelltech-${family}-glass-horizontal-${theme}-final.png`,
    ),
  });
  await context.close();
}

await browser.close();
