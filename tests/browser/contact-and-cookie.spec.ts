import { expect, test } from "@playwright/test";

test.describe("contact form", () => {
  test("submits successfully and shows the redirected status", async ({
    page,
  }) => {
    await page.route("**/contact/", async (route) => {
      if (route.request().method() !== "POST") return route.continue();
      await route.fulfill({
        status: 303,
        headers: { location: "/contact/?submitted=success" },
      });
    });

    await page.goto("/contact/");
    await page.getByLabel("Name").fill("Alice Example");
    await page.getByLabel("Email").fill("alice@example.com");
    await page.getByLabel("Company").fill("Example Ltd");
    await page.getByLabel("What do you need?").selectOption("Website");
    await page.getByLabel("Budget or timeline").fill("This quarter");
    await page
      .getByLabel("Tell us about the project")
      .fill("Please help with our new website.");

    await page.getByRole("button", { name: /Send transmission/ }).click();

    await expect(page.getByRole("status")).toHaveText(
      "Transmission received — we’ll be in touch.",
    );
    await expect(page).toHaveURL(/\/contact\/\?submitted=success$/);
  });

  test("shows the redirected error", async ({ page }) => {
    await page.route("**/contact/", async (route) => {
      if (route.request().method() !== "POST") return route.continue();
      await route.fulfill({
        status: 303,
        headers: { location: "/contact/?error=invalid" },
      });
    });

    await page.goto("/contact/");
    await page.getByLabel("Name").fill("Alice Example");
    await page.getByLabel("Email").fill("alice@example.com");
    await page.getByLabel("What do you need?").selectOption("Website");
    await page
      .getByLabel("Tell us about the project")
      .fill("A valid project message.");

    await page.getByRole("button", { name: /Send transmission/ }).click();

    await expect(page.getByRole("status")).toHaveText(
      "Please check the highlighted fields before sending.",
    );
    await expect(page).toHaveURL(/\/contact\/\?error=invalid$/);
  });
});

test.describe("cookie notice", () => {
  test("can be dismissed and remains dismissed after reload", async ({
    page,
  }) => {
    await page.goto("/");
    await page.evaluate(() => localStorage.clear());
    await page.reload();

    const notice = page.locator("[data-cookie-notice]");
    await expect(notice).toBeVisible();

    await notice.getByRole("button", { name: "Got it" }).click();

    await expect(notice).toBeHidden();
    await expect
      .poll(() =>
        page.evaluate(() => localStorage.getItem("rt-privacy-notice")),
      )
      .toBe("seen");

    await page.reload();
    await expect(page.locator("[data-cookie-notice]")).toBeHidden();
  });
});
