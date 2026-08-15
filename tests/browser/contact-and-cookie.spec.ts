import { expect, test } from "@playwright/test";

test.describe("contact form", () => {
  test("submits successfully and resets the form", async ({ page }) => {
    await page.route("**/api/contact", async (route) => {
      await route.fulfill({
        contentType: "application/json",
        body: JSON.stringify({ message: "Sent" }),
        status: 200,
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
    await expect(page.getByLabel("Name")).toHaveValue("");
    await expect(page.getByLabel("Email")).toHaveValue("");
    await expect(
      page.getByRole("button", { name: /Send transmission/ }),
    ).toBeEnabled();
  });

  test("shows the API error and re-enables submission", async ({ page }) => {
    await page.route("**/api/contact", async (route) => {
      await route.fulfill({
        contentType: "application/json",
        body: JSON.stringify({
          message: "Please check the form fields and try again.",
        }),
        status: 400,
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
      "Please check the form fields and try again.",
    );
    await expect(
      page.getByRole("button", { name: /Send transmission/ }),
    ).toBeEnabled();
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
