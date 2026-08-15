# Security

## Controls in this project

- Astro generates a per-page Content Security Policy with SHA-384 hashes. The
  policy does not allow `unsafe-inline` or `unsafe-eval`.
- Cloudflare Pages adds clickjacking, MIME-sniffing, referrer, permissions,
  cross-origin and HSTS response headers from `public/_headers`.
- The contact endpoint accepts only same-origin, size-bounded form posts with a
  strict field allowlist and length limits.
- Turnstile is mandatory and is checked server-side for the expected hostname
  and `contact` action. The endpoint fails closed if its secret is missing.
- Contact values are escaped before HTML email generation. The email binding is
  restricted to Russell Tech's intended sender and recipient addresses.
- Logs contain event names, error classes and Cloudflare Ray IDs, not submitted
  contact details.

## Production deployment checklist

1. Create a production Turnstile widget restricted to the exact production
   hostname or hostnames.
2. Set `PUBLIC_TURNSTILE_SITE_KEY` as the build-time public value and
   `TURNSTILE_SECRET_KEY` as an encrypted Cloudflare Pages secret. Use different
   widgets and secrets for preview and production.
3. Onboard `russell-tech.co.uk` with Cloudflare Email Service and verify both
   destination inboxes before testing the form.
4. In Cloudflare Security > WAF > Managed rules, deploy the current Cloudflare
   Managed Ruleset and keep the default actions initially. Review Security
   Events after the first genuine submissions before adding exceptions.
5. In Security > WAF > Rate limiting rules, add `POST /api/contact` with this
   expression: `http.host eq "russell-tech.co.uk" and http.request.uri.path eq
"/api/contact" and http.request.method eq "POST"`. Count by IP and use 10
   requests per 10 minutes with a 10-minute Block mitigation. This is an edge
   backstop; the Worker binding remains the primary 5-per-minute safeguard.
6. Confirm Workers Logs are arriving under Workers & Pages > russell-tech >
   Observability. Create notifications for sustained `5xx` and `429` responses
   on `russell-tech.co.uk` (start at 5% of requests over 5 minutes), and use
   Workers Logs queries for these structured events: `contact_delivery_error`,
   `turnstile_verification_failed`, `turnstile_verification_error`, and
   `contact_rate_limited`. If email/webhook notifications are required for
   those custom events, connect Workers Logpush or a Tail Worker to the chosen
   alert destination; Workers Logs itself provides the searchable event store.
7. Verify the deployed CSP and response headers, then submit one genuine form
   enquiry end to end. Local tests do not prove production email delivery.

## Local verification

```sh
npm audit --audit-level=low
npm test
ASTRO_TELEMETRY_DISABLED=1 npm run build
npm run verify:security
npx wrangler types --check
```

Keep secrets in `.dev.vars` locally. Never commit `.dev.vars`, `.env` files,
API tokens or exported Cloudflare configuration containing secret values.
