import sitemap from "@astrojs/sitemap";
import { defineConfig } from "astro/config";

export default defineConfig({
  site: "https://russell-tech.co.uk",
  output: "static",
  integrations: [sitemap()],
  build: { format: "directory", inlineStylesheets: "never" },
  markdown: { syntaxHighlight: false },
  security: {
    csp: {
      algorithm: "SHA-384",
      directives: [
        "default-src 'self'",
        "base-uri 'self'",
        "connect-src 'self' https://challenges.cloudflare.com https://cloudflareinsights.com",
        "font-src 'self' https://fonts.gstatic.com",
        "form-action 'self'",
        "frame-src https://challenges.cloudflare.com",
        "img-src 'self' data:",
        "manifest-src 'self'",
        "media-src 'none'",
        "object-src 'none'",
        "upgrade-insecure-requests",
        "worker-src 'none'",
      ],
      scriptDirective: {
        resources: [
          "'self'",
          "https://challenges.cloudflare.com",
          "https://static.cloudflareinsights.com/beacon.min.js",
        ],
      },
      styleDirective: {
        resources: ["'self'", "https://fonts.googleapis.com"],
      },
    },
  },
});
