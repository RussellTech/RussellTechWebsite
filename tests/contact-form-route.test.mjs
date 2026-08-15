import { afterEach, describe, expect, it, vi } from "vitest";

import { onRequestPost } from "../functions/contact.ts";

afterEach(() => {
  vi.restoreAllMocks();
});

const fields = {
  name: "Alice Example",
  email: "alice@example.com",
  company: "Example Ltd",
  projectType: "Website",
  budget: "This quarter",
  message: "Please help with our new website.",
  website: "",
  "cf-turnstile-response": "valid-token",
  "static-form-name": "contact",
};

const makeRequest = (overrides = {}) => {
  const body = new URLSearchParams({ ...fields, ...overrides }).toString();
  return new Request("https://russell-tech.co.uk/contact/", {
    method: "POST",
    headers: {
      origin: "https://russell-tech.co.uk",
      "sec-fetch-site": "same-origin",
      "content-type": "application/x-www-form-urlencoded",
      "content-length": String(new TextEncoder().encode(body).byteLength),
    },
    body,
  });
};

const makeEnv = (send = vi.fn(), secret = "test-secret", limiter) => ({
  ...(secret ? { TURNSTILE_SECRET_KEY: secret } : {}),
  ...(limiter ? { CONTACT_RATE_LIMITER: limiter } : {}),
  EMAIL: { send },
});

const passTurnstile = () => {
  vi.stubGlobal(
    "fetch",
    vi.fn(async () =>
      Response.json({
        success: true,
        hostname: "russell-tech.co.uk",
        action: "contact",
      }),
    ),
  );
};

describe("native contact form route", () => {
  it("redirects successful submissions back to the contact page", async () => {
    passTurnstile();
    const response = await onRequestPost({
      request: makeRequest(),
      env: makeEnv(),
    });

    expect(response.status).toBe(303);
    expect(response.headers.get("location")).toBe(
      "https://russell-tech.co.uk/contact/?submitted=success",
    );
  });

  it("maps rate limits to the Aaron-style error redirect", async () => {
    const response = await onRequestPost({
      request: makeRequest(),
      env: makeEnv(vi.fn(), "test-secret", {
        limit: vi.fn(async () => ({ success: false })),
      }),
    });

    expect(response.headers.get("location")).toContain("error=rate_limited");
  });

  it("maps validation errors to the invalid redirect", async () => {
    const response = await onRequestPost({
      request: makeRequest({ projectType: "Invalid" }),
      env: makeEnv(),
    });

    expect(response.headers.get("location")).toContain("error=invalid");
  });

  it("maps Turnstile errors to the verification redirect", async () => {
    const response = await onRequestPost({
      request: makeRequest({ "cf-turnstile-response": "" }),
      env: makeEnv(),
    });

    expect(response.headers.get("location")).toContain("error=verification");
  });

  it("maps configuration failures to the blocked redirect", async () => {
    const response = await onRequestPost({
      request: makeRequest(),
      env: makeEnv(vi.fn(), ""),
    });

    expect(response.headers.get("location")).toContain("error=blocked");
  });
});
