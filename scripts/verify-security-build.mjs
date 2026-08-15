import { createHash } from "node:crypto";
import { readdir, readFile } from "node:fs/promises";

const dist = new URL("../dist/", import.meta.url);

const findHtmlFiles = async (directory) => {
  const entries = await readdir(directory, { withFileTypes: true });
  const files = await Promise.all(
    entries.map(async (entry) => {
      const url = new URL(
        entry.name + (entry.isDirectory() ? "/" : ""),
        directory,
      );
      if (entry.isDirectory()) return findHtmlFiles(url);
      return entry.name.endsWith(".html") ? [url] : [];
    }),
  );

  return files.flat();
};

const hash = (content) =>
  `sha384-${createHash("sha384").update(content).digest("base64")}`;

const verifyInlineContent = (html, csp, tagName, file) => {
  const pattern = new RegExp(
    `<${tagName}\\b([^>]*)>([\\s\\S]*?)<\\/${tagName}>`,
    "gi",
  );

  for (const match of html.matchAll(pattern)) {
    const [, attributes, content] = match;
    if (tagName === "script" && /\bsrc\s*=/.test(attributes)) continue;

    const requiredHash = hash(content);
    if (!csp.includes(`'${requiredHash}'`)) {
      throw new Error(
        `${file.pathname} is missing ${tagName} hash ${requiredHash}`,
      );
    }
  }
};

const htmlFiles = await findHtmlFiles(dist);
if (htmlFiles.length === 0) throw new Error("No built HTML files found.");

for (const file of htmlFiles) {
  const html = await readFile(file, "utf8");
  const csp = html.match(
    /<meta http-equiv="content-security-policy" content="([^"]+)"/i,
  )?.[1];

  if (!csp) throw new Error(`${file.pathname} has no Content Security Policy.`);
  if (/'unsafe-inline'|'unsafe-eval'/.test(csp)) {
    throw new Error(`${file.pathname} contains an unsafe CSP source.`);
  }

  verifyInlineContent(html, csp, "script", file);
  verifyInlineContent(html, csp, "style", file);
}

const headers = await readFile(new URL("_headers", dist), "utf8");
for (const requiredHeader of [
  "Content-Security-Policy: frame-ancestors 'none'",
  "Cross-Origin-Opener-Policy: same-origin",
  "Cross-Origin-Resource-Policy: same-origin",
  "Strict-Transport-Security: max-age=31536000",
  "X-Content-Type-Options: nosniff",
  "X-Frame-Options: DENY",
  "X-Permitted-Cross-Domain-Policies: none",
]) {
  if (!headers.includes(requiredHeader)) {
    throw new Error(`Built headers are missing: ${requiredHeader}`);
  }
}

console.log(
  `Verified CSP hashes and security headers for ${htmlFiles.length} pages.`,
);
