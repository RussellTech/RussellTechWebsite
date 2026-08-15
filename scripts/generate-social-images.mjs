import fs from "node:fs";
import path from "node:path";
import sharp from "sharp";
import { getSocialImagePath } from "../src/data/social-images.mjs";

const rootDirectory = path.resolve(".");
const publicDirectory = path.join(rootDirectory, "public");
const distDirectory = path.join(rootDirectory, "dist");
const socialDirectory = path.join(publicDirectory, "social");
const distSocialDirectory = path.join(distDirectory, "social");
const backgroundPath = path.join(socialDirectory, "social-background.png");
const logoPath = path.join(publicDirectory, "logo-on-dark.svg");

if (!fs.existsSync(distDirectory)) {
  throw new Error("Build the site before generating its social images.");
}

if (!fs.existsSync(backgroundPath)) {
  throw new Error(`Missing social-card background: ${backgroundPath}`);
}

fs.mkdirSync(socialDirectory, { recursive: true });
fs.mkdirSync(distSocialDirectory, { recursive: true });

const logoData = fs.readFileSync(logoPath).toString("base64");
const background = await sharp(backgroundPath)
  .resize(1200, 630, { fit: "cover", position: "centre" })
  .png()
  .toBuffer();

const decodeHtml = (value) =>
  value
    .replace(/<[^>]+>/g, " ")
    .replace(/&#(\d+);/g, (_, code) => String.fromCodePoint(Number(code)))
    .replace(/&#x([0-9a-f]+);/gi, (_, code) =>
      String.fromCodePoint(Number.parseInt(code, 16)),
    )
    .replace(/&amp;/g, "&")
    .replace(/&quot;/g, '"')
    .replace(/&#39;|&apos;/g, "'")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/\s+/g, " ")
    .trim();

const escapeXml = (value) =>
  value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&apos;");

const htmlFiles = [];
const collectHtmlFiles = (directory) => {
  for (const entry of fs.readdirSync(directory, { withFileTypes: true })) {
    const entryPath = path.join(directory, entry.name);
    if (entry.isDirectory()) collectHtmlFiles(entryPath);
    if (entry.isFile() && entry.name === "index.html") htmlFiles.push(entryPath);
  }
};
collectHtmlFiles(distDirectory);

const routeForFile = (filename) => {
  const relative = path.relative(distDirectory, filename);
  const route = relative
    .replace(/index\.html$/, "")
    .split(path.sep)
    .filter(Boolean)
    .join("/");
  return route ? `/${route}/` : "/";
};

const categoryForRoute = (route) => {
  const segments = route.split("/").filter(Boolean);
  if (route === "/") return "Russell Tech";
  if (segments[0] === "services")
    return segments.length > 1 ? "Digital service" : "Services";
  if (segments[0] === "projects")
    return segments.length > 1 ? "Case study" : "Selected work";
  if (segments[0] === "insights")
    return segments.length > 1 ? "Insight" : "Insights";
  if (segments[0] === "about") return "About the studio";
  if (segments[0] === "contact") return "Start a conversation";
  if (segments[0] === "privacy") return "Privacy";
  return "Russell Tech";
};

const accentForRoute = (route) => {
  if (route.startsWith("/services")) return "#45D9FF";
  if (route.startsWith("/projects")) return "#77FFC0";
  if (route.startsWith("/insights")) return "#FF4FC7";
  if (route.startsWith("/about")) return "#FFD166";
  if (route.startsWith("/contact")) return "#FF7B6B";
  return "#A94AF4";
};

const getHeadlineStyle = (headline) => {
  if (headline.length <= 28) return { fontSize: 58, maxCharacters: 24 };
  if (headline.length <= 48) return { fontSize: 54, maxCharacters: 27 };
  if (headline.length <= 68) return { fontSize: 50, maxCharacters: 30 };
  return { fontSize: 44, maxCharacters: 34 };
};

const wrapHeadline = (headline, maxCharacters) => {
  const words = headline.split(/\s+/);
  const lines = [];
  let currentLine = "";

  for (const word of words) {
    const nextLine = currentLine ? `${currentLine} ${word}` : word;
    if (currentLine && nextLine.length > maxCharacters) {
      lines.push(currentLine);
      currentLine = word;
    } else {
      currentLine = nextLine;
    }
  }

  if (currentLine) lines.push(currentLine);
  return lines;
};

const extractContent = (html, expression, fallback) => {
  const match = html.match(expression);
  return decodeHtml(match?.[1] ?? fallback);
};

const generated = [];

for (const htmlFile of htmlFiles.sort()) {
  const html = fs.readFileSync(htmlFile, "utf8");
  const route = routeForFile(htmlFile);
  const pageTitle = extractContent(
    html,
    /<title>([\s\S]*?)<\/title>/i,
    "Russell Tech",
  ).replace(/\s*\|\s*Russell Tech\s*$/i, "");
  const headline = extractContent(
    html,
    /<h1[^>]*>([\s\S]*?)<\/h1>/i,
    pageTitle,
  );
  const category = categoryForRoute(route);
  const accent = accentForRoute(route);
  const { fontSize, maxCharacters } = getHeadlineStyle(headline);
  const lines = wrapHeadline(headline, maxCharacters);
  const lineHeight = Math.round(fontSize * 1.08);
  const firstLineY = Math.max(260, 352 - (lines.length - 1) * lineHeight * 0.52);
  const headlineLines = lines
    .map(
      (line, index) =>
        `<tspan x="72" y="${Math.round(firstLineY + index * lineHeight)}">${escapeXml(line)}</tspan>`,
    )
    .join("");

  const overlay = `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="630" viewBox="0 0 1200 630">
  <defs>
    <linearGradient id="leftShade" x1="0" y1="0" x2="1" y2="0">
      <stop offset="0" stop-color="#030914" stop-opacity="0.98"/>
      <stop offset="0.46" stop-color="#030914" stop-opacity="0.83"/>
      <stop offset="0.7" stop-color="#030914" stop-opacity="0.18"/>
      <stop offset="1" stop-color="#030914" stop-opacity="0"/>
    </linearGradient>
    <linearGradient id="bottomShade" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0.64" stop-color="#030914" stop-opacity="0"/>
      <stop offset="1" stop-color="#030914" stop-opacity="0.72"/>
    </linearGradient>
  </defs>
  <rect width="1200" height="630" fill="url(#leftShade)"/>
  <rect width="1200" height="630" fill="url(#bottomShade)"/>
  <image href="data:image/svg+xml;base64,${logoData}" x="72" y="48" width="300" height="80"/>
  <rect x="72" y="170" width="16" height="4" rx="2" fill="${accent}"/>
  <text x="100" y="178" fill="${accent}" font-family="Arial, Helvetica, sans-serif" font-size="18" font-weight="700" letter-spacing="2.8">${escapeXml(category.toUpperCase())}</text>
  <text fill="#F8FAFF" font-family="Arial, Helvetica, sans-serif" font-size="${fontSize}" font-weight="700" letter-spacing="-1.8">${headlineLines}</text>
  <text x="72" y="560" fill="#B5BFD3" font-family="Arial, Helvetica, sans-serif" font-size="22" font-weight="500">russell-tech.co.uk</text>
  <rect x="72" y="590" width="92" height="4" rx="2" fill="#45D9FF"/>
  <rect x="164" y="590" width="78" height="4" rx="2" fill="#3279FF"/>
  <rect x="242" y="590" width="70" height="4" rx="2" fill="#A94AF4"/>
  <rect x="312" y="590" width="56" height="4" rx="2" fill="#FF4FC7"/>
  <rect x="368" y="590" width="42" height="4" rx="2" fill="#FFD166"/>
</svg>`;

  const outputUrl = getSocialImagePath(route);
  const outputFilename = path.basename(outputUrl);
  const publicOutput = path.join(socialDirectory, outputFilename);
  const distOutput = path.join(distSocialDirectory, outputFilename);
  const image = await sharp(background)
    .composite([{ input: Buffer.from(overlay) }])
    .png({ compressionLevel: 9 })
    .toBuffer();

  fs.writeFileSync(publicOutput, image);
  fs.writeFileSync(distOutput, image);
  generated.push({ route, outputUrl, headline });
}

fs.writeFileSync(
  path.join(socialDirectory, "manifest.json"),
  `${JSON.stringify(generated, null, 2)}\n`,
);
fs.copyFileSync(
  path.join(socialDirectory, "manifest.json"),
  path.join(distSocialDirectory, "manifest.json"),
);

console.log(`Generated ${generated.length} route-specific social images.`);
