import { chromium } from "playwright";

const browser = await chromium.launch({ headless: true });
const page = await browser.newPage({ viewport: { width: 1440, height: 1000 } });
const browserMessages = [];
page.on("console", (message) =>
  browserMessages.push(`${message.type()}: ${message.text()}`),
);
page.on("pageerror", (error) =>
  browserMessages.push(`pageerror: ${error.message}`),
);

await page.goto("http://127.0.0.1:4321/", { waitUntil: "networkidle" });

const inspectBrand = async () =>
  page.evaluate(() => {
    const header = document.querySelector("header");
    const darkLogo = header?.querySelector(".logo-on-dark");
    const lightLogo = header?.querySelector(".logo-on-light");
    const favicon = document.querySelector("#theme-favicon");
    const manifest = document.querySelector('link[rel="manifest"]');
    const socialImage = document.querySelector('meta[property="og:image"]');
    return {
      theme: document.documentElement.dataset.theme || "dark",
      darkLogoDisplay: darkLogo ? getComputedStyle(darkLogo).display : null,
      lightLogoDisplay: lightLogo ? getComputedStyle(lightLogo).display : null,
      darkLogoWidth: darkLogo?.getBoundingClientRect().width ?? null,
      lightLogoWidth: lightLogo?.getBoundingClientRect().width ?? null,
      favicon: favicon?.getAttribute("href") ?? null,
      manifest: manifest?.getAttribute("href") ?? null,
      socialImage: socialImage?.getAttribute("content") ?? null,
    };
  });

const dark = await inspectBrand();
await page.screenshot({ path: "test-results/brand-dark.png", fullPage: true });

await page.locator(".theme-toggle").click();
await page.waitForTimeout(150);
const light = await inspectBrand();
await page.screenshot({ path: "test-results/brand-light.png", fullPage: true });

await page.setViewportSize({ width: 390, height: 844 });
await page.reload({ waitUntil: "networkidle" });
const horizontalOverflow = await page.evaluate(
  () =>
    document.documentElement.scrollWidth > document.documentElement.clientWidth,
);
await page.screenshot({
  path: "test-results/brand-mobile.png",
  fullPage: false,
});

console.log(
  JSON.stringify({ dark, light, horizontalOverflow, browserMessages }, null, 2),
);
await browser.close();
