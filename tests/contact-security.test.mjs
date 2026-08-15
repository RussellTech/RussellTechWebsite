import { afterEach, describe, expect, it, vi } from "vitest";

import { handleContact } from "../functions/api/contact.ts";

const originalFetch = globalThis.fetch;

afterEach(() => {
  globalThis.fetch = originalFetch;
  vi.restoreAllMocks();
});

const validFields = {
  name: "Alice Example",
  email: "alice@example.com",
  company: "Example Ltd",
  projectType: "Website",
  budget: "This quarter",
  message: "Please help with our new website.",
  website: "",
  "cf-turnstile-response": "valid-token",
};

const makeRequest = (
  fields = validFields,
  {
    origin = "https://russell-tech.co.uk",
    fetchSite = "same-origin",
    contentLength,
  } = {},
) => {
  const body = new URLSearchParams(fields).toString();
  const byteLength = new TextEncoder().encode(body).byteLength;

  return new Request("https://russell-tech.co.uk/api/contact", {
    method: "POST",
    headers: {
      "content-type": "application/x-www-form-urlencoded",
      "content-length": String(contentLength ?? byteLength),
      ...(origin ? { origin } : {}),
      ...(fetchSite ? { "sec-fetch-site": fetchSite } : {}),
    },
    body,
  });
};

const makeEnv = (send, secret = "test-secret") => ({
  ...(secret ? { TURNSTILE_SECRET_KEY: secret } : {}),
  EMAIL: { send },
});

const makeRateLimiter = (success) => ({
  limit: vi.fn(async () => ({ success })),
});

const passTurnstile = () => {
  globalThis.fetch = vi.fn(async () =>
    Response.json({
      success: true,
      hostname: "russell-tech.co.uk",
      action: "contact",
    }),
  );
};

describe("contact endpoint hardening", () => {
  it("rejects cross-site submissions before any external call", async () => {
    const send = vi.fn();
    globalThis.fetch = vi.fn();

    const response = await handleContact(
      makeRequest(validFields, {
        origin: "https://attacker.example",
        fetchSite: "cross-site",
      }),
      makeEnv(send),
    );

    expect(response.status).toBe(403);
    expect(globalThis.fetch).not.toHaveBeenCalled();
    expect(send).not.toHaveBeenCalled();
    expect(response.headers.get("cache-control")).toBe("no-store");
    expect(response.headers.get("strict-transport-security")).toBe(
      "max-age=31536000",
    );
    expect(response.headers.get("x-content-type-options")).toBe("nosniff");
    expect(response.headers.get("x-frame-options")).toBe("DENY");
  });

  it("rejects oversized bodies before parsing them", async () => {
    const response = await handleContact(
      makeRequest(validFields, { contentLength: 16_385 }),
      makeEnv(vi.fn()),
    );

    expect(response.status).toBe(413);
  });

  it("fails closed when the Turnstile secret is not configured", async () => {
    vi.spyOn(console, "error").mockImplementation(() => {});

    const response = await handleContact(makeRequest(), makeEnv(vi.fn(), ""));

    expect(response.status).toBe(503);
  });

  it("records and returns a 429 when the contact limiter is exceeded", async () => {
    const warn = vi.spyOn(console, "warn").mockImplementation(() => {});

    const response = await handleContact(makeRequest(), {
      ...makeEnv(vi.fn()),
      CONTACT_RATE_LIMITER: makeRateLimiter(false),
    });

    expect(response.status).toBe(429);
    expect(warn).toHaveBeenCalledWith(
      expect.objectContaining({
        event: "contact_rate_limited",
        status: "429",
      }),
    );
  });

  it("rejects unexpected project types before Turnstile verification", async () => {
    globalThis.fetch = vi.fn();

    const response = await handleContact(
      makeRequest({ ...validFields, projectType: "Arbitrary value" }),
      makeEnv(vi.fn()),
    );

    expect(response.status).toBe(400);
    expect(globalThis.fetch).not.toHaveBeenCalled();
  });

  it("rejects a Turnstile token issued for another action", async () => {
    const send = vi.fn();
    const warn = vi.spyOn(console, "warn").mockImplementation(() => {});
    globalThis.fetch = vi.fn(async () =>
      Response.json({
        success: true,
        hostname: "russell-tech.co.uk",
        action: "login",
      }),
    );

    const response = await handleContact(makeRequest(), makeEnv(send));

    expect(response.status).toBe(400);
    expect(send).not.toHaveBeenCalled();
    expect(warn).toHaveBeenCalledWith(
      expect.objectContaining({ event: "turnstile_verification_failed" }),
    );
  });

  it("escapes all user-controlled HTML before sending email", async () => {
    const send = vi.fn(async () => ({ messageId: "sent" }));
    passTurnstile();

    const response = await handleContact(
      makeRequest({
        ...validFields,
        company: '<img src=x onerror="alert(1)">',
        message: "Hello <script>alert('xss')</script>\nSecond line",
      }),
      makeEnv(send),
    );
    const sentMessage = send.mock.calls[0]?.[0];

    expect(response.status).toBe(200);
    expect(sentMessage).toBeDefined();
    expect(sentMessage.html).not.toMatch(/<script>|<img/);
    expect(sentMessage.html).toMatch(/&lt;script&gt;/);
    expect(sentMessage.html).toMatch(
      /&lt;img src=x onerror=&quot;alert\(1\)&quot;&gt;/,
    );
    expect(sentMessage.to).toEqual(["info@russell-tech.co.uk"]);
    expect(sentMessage.replyTo).toBe("alice@example.com");
  });
});
