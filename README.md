# Russell Tech

The Russell Tech agency website: a static Astro site for showcasing web development, testing, infrastructure and related digital services.

## Stack

- Astro with TypeScript and static output
- Markdown content collections for projects and insights
- Cloudflare Pages for hosting
- Cloudflare Email Service and Turnstile for the contact form
- Vitest and Playwright for automated testing

## Local development

Requirements: Node.js 22 and npm.

```sh
npm ci
npm run dev
```

Useful checks:

```sh
npm run format:check
npm test
npm run test:security
npm run test:browser
ASTRO_TELEMETRY_DISABLED=1 npm run build
npm run verify:security
```

Copy `.env.example` for public build-time variables. Contact-form secrets belong in `.dev.vars` locally and in Cloudflare Pages secrets in production. Do not commit either file.

## Deployment

Pull requests run formatting, dependency auditing, unit/security/browser tests and a production build in GitHub Actions. Pushes to `main` deploy the verified build to the `russell-tech` Cloudflare Pages project.

The deployment job requires these GitHub Actions secrets:

- `CLOUDFLARE_API_TOKEN`
- `CLOUDFLARE_ACCOUNT_ID`

Production contact-form setup and security checks are documented in [SECURITY.md](SECURITY.md).

## Contributing

Create a focused branch, make the smallest useful change, and run the relevant checks before opening a pull request. Pull requests should explain the user-facing impact and call out any required Cloudflare or environment configuration.

## Licence

Copyright © Russell Tech Limited. All rights reserved unless otherwise stated.
