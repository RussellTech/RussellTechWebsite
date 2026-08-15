export type RuntimeEnv = Cloudflare.Env & {
  CONTACT_RATE_LIMITER?: RateLimit;
  TURNSTILE_SECRET_KEY?: string;
};

type TurnstileResult = {
  success?: boolean;
  hostname?: string;
  action?: string;
  "error-codes"?: string[];
};

const MAX_BODY_BYTES = 16_384;
const TURNSTILE_ACTION = "contact";
const CONTACT_SUBJECT = "New Russell Tech website enquiry";
const ALLOWED_FIELDS = new Set([
  "name",
  "email",
  "company",
  "projectType",
  "budget",
  "message",
  "website",
  "cf-turnstile-response",
  "static-form-name",
]);
const ALLOWED_PROJECT_TYPES = new Set([
  "Mobile app",
  "Website",
  "Custom CMS",
  "Hosting & infrastructure",
  "Something else",
]);

const logEvent = (
  level: "error" | "warn",
  event: string,
  request: Request,
  details: Record<string, string> = {},
) => {
  console[level]({
    event,
    ray: request.headers.get("cf-ray") ?? "unknown",
    ...details,
  });
};

const json = (message: string, status = 200) =>
  Response.json(
    { message },
    {
      status,
      headers: {
        "cache-control": "no-store",
        "content-security-policy":
          "default-src 'none'; frame-ancestors 'none'; sandbox",
        "cross-origin-opener-policy": "same-origin",
        "cross-origin-resource-policy": "same-origin",
        "permissions-policy":
          "camera=(), display-capture=(), geolocation=(), microphone=(), payment=(), usb=()",
        "referrer-policy": "no-referrer",
        "strict-transport-security": "max-age=31536000",
        vary: "Origin",
        "x-content-type-options": "nosniff",
        "x-frame-options": "DENY",
        "x-permitted-cross-domain-policies": "none",
      },
    },
  );

const isSameOriginRequest = (request: Request) => {
  const origin = request.headers.get("origin");
  const fetchSite = request.headers.get("sec-fetch-site");

  return (
    origin === new URL(request.url).origin &&
    (!fetchSite || fetchSite === "same-origin")
  );
};

const isSupportedContentType = (request: Request) => {
  const contentType = request.headers.get("content-type")?.toLowerCase() ?? "";

  return (
    contentType.startsWith("application/x-www-form-urlencoded") ||
    contentType.startsWith("multipart/form-data;")
  );
};

const getText = (form: FormData, key: string) => {
  const value = form.get(key);
  return typeof value === "string" ? value.trim() : null;
};

const isSingleLine = (value: string, maxLength: number) =>
  value.length <= maxLength && !/[\u0000-\u001f\u007f]/.test(value);

const isMessage = (value: string) =>
  value.length > 0 &&
  value.length <= 5_000 &&
  !/[\u0000-\u0008\u000b\u000c\u000e-\u001f\u007f]/.test(value);

const isEmail = (value: string) =>
  value.length <= 254 &&
  /^[^\s@<>()\\,;:"]+@[^\s@<>()\\,;:"]+\.[^\s@<>()\\,;:"]+$/.test(value);

const escapeHtml = (value: string) =>
  value.replace(
    /[&<>"']/g,
    (character) =>
      ({
        "&": "&amp;",
        "<": "&lt;",
        ">": "&gt;",
        '"': "&quot;",
        "'": "&#39;",
      })[character] ?? character,
  );

const verifyTurnstile = async (
  request: Request,
  secret: string,
  token: string,
): Promise<boolean> => {
  const remoteIp = request.headers.get("cf-connecting-ip");
  const payload: Record<string, string> = {
    secret,
    response: token,
    idempotency_key: crypto.randomUUID(),
  };

  if (remoteIp) payload.remoteip = remoteIp;

  const verification = await fetch(
    "https://challenges.cloudflare.com/turnstile/v0/siteverify",
    {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify(payload),
      signal: AbortSignal.timeout(5_000),
    },
  );

  if (!verification.ok) return false;

  const result = (await verification.json()) as TurnstileResult;
  return (
    result.success === true &&
    result.hostname === new URL(request.url).hostname &&
    result.action === TURNSTILE_ACTION
  );
};

export const handleContact = async (
  request: Request,
  env: RuntimeEnv,
): Promise<Response> => {
  if (!isSameOriginRequest(request)) {
    return json("Request not allowed.", 403);
  }

  if (env.CONTACT_RATE_LIMITER) {
    const clientKey = request.headers.get("cf-connecting-ip") ?? "unknown";
    const { success } = await env.CONTACT_RATE_LIMITER.limit({
      key: `contact:${clientKey}`,
    });

    if (!success) {
      logEvent("warn", "contact_rate_limited", request, { status: "429" });
      return json("Too many enquiries. Please try again later.", 429);
    }
  }

  if (!isSupportedContentType(request)) {
    return json("Unsupported form submission.", 415);
  }

  const contentLengthHeader = request.headers.get("content-length");
  const contentLength = Number(contentLengthHeader);

  if (
    !contentLengthHeader ||
    !Number.isSafeInteger(contentLength) ||
    contentLength <= 0
  ) {
    return json("A content length is required.", 411);
  }

  if (contentLength > MAX_BODY_BYTES) {
    return json("Your enquiry is too large.", 413);
  }

  if (!env.TURNSTILE_SECRET_KEY) {
    logEvent("error", "contact_configuration_error", request, {
      status: "503",
    });
    return json("The contact form is temporarily unavailable.", 503);
  }

  let form: FormData;
  try {
    form = await request.formData();
  } catch {
    return json("Invalid form submission.", 400);
  }

  for (const [key, value] of form.entries()) {
    if (!ALLOWED_FIELDS.has(key) || typeof value !== "string") {
      return json("Invalid form submission.", 400);
    }
  }

  for (const key of ALLOWED_FIELDS) {
    if (form.getAll(key).length > 1) {
      return json("Invalid form submission.", 400);
    }
  }

  const name = getText(form, "name");
  const email = getText(form, "email");
  const company = getText(form, "company") ?? "";
  const projectType = getText(form, "projectType");
  const budget = getText(form, "budget") ?? "";
  const message = getText(form, "message");
  const honeypot = getText(form, "website") ?? "";
  const token = getText(form, "cf-turnstile-response");

  if (honeypot) return json("Sent");

  if (
    !name ||
    !email ||
    !projectType ||
    !message ||
    !isSingleLine(name, 100) ||
    !isEmail(email) ||
    !isSingleLine(company, 150) ||
    !ALLOWED_PROJECT_TYPES.has(projectType) ||
    !isSingleLine(budget, 200) ||
    !isMessage(message)
  ) {
    return json("Please check the form fields and try again.", 400);
  }

  if (!token || token.length > 2_048) {
    logEvent("warn", "turnstile_verification_failed", request, {
      reason: "missing_or_invalid_token",
      status: "400",
    });
    return json("Please complete the spam check and try again.", 400);
  }

  try {
    if (!(await verifyTurnstile(request, env.TURNSTILE_SECRET_KEY, token))) {
      logEvent("warn", "turnstile_verification_failed", request, {
        status: "400",
      });
      return json("Please complete the spam check and try again.", 400);
    }
  } catch (error) {
    logEvent("error", "turnstile_verification_error", request, {
      error: error instanceof Error ? error.name : "UnknownError",
      status: "503",
    });
    return json("The spam check is temporarily unavailable.", 503);
  }

  const text = [
    `Name: ${name}`,
    `Email: ${email}`,
    `Company: ${company || "Not provided"}`,
    `Project: ${projectType}`,
    `Budget/timeline: ${budget || "Not provided"}`,
    "",
    message,
  ].join("\n");
  const html = [
    "<h2>New Russell Tech enquiry</h2>",
    `<p><strong>Name:</strong> ${escapeHtml(name)}</p>`,
    `<p><strong>Email:</strong> ${escapeHtml(email)}</p>`,
    `<p><strong>Company:</strong> ${escapeHtml(company || "Not provided")}</p>`,
    `<p><strong>Project:</strong> ${escapeHtml(projectType)}</p>`,
    `<p><strong>Budget/timeline:</strong> ${escapeHtml(budget || "Not provided")}</p>`,
    `<p>${escapeHtml(message).replaceAll("\n", "<br>")}</p>`,
  ].join("");

  try {
    await env.EMAIL.send({
      to: ["info@russell-tech.co.uk"],
      from: {
        email: "website@russell-tech.co.uk",
        name: "Russell Tech website",
      },
      replyTo: email,
      subject: CONTACT_SUBJECT,
      text,
      html,
    });
    return json("Sent");
  } catch (error) {
    logEvent("error", "contact_delivery_error", request, {
      error: error instanceof Error ? error.name : "UnknownError",
      status: "503",
    });
    return json("Unable to send your enquiry right now.", 503);
  }
};

export const onRequestPost: PagesFunction<RuntimeEnv> = ({ request, env }) =>
  handleContact(request, env);
