import fs from "node:fs";
import path from "node:path";
import sharp from "sharp";

const publicDirectory = path.resolve("public");
const brandDirectory = path.join(publicDirectory, "brand");

const readBrandAsset = (filename) =>
  fs.readFileSync(path.join(brandDirectory, filename), "utf8");

const removeBackground = (svg) =>
  svg.replace(
    /\s*<rect width="720" height="190" fill="#[0-9A-Fa-f]{6}"\/>/,
    "",
  );

const darkHorizontal = removeBackground(
  readBrandAsset("russelltech-quad-refraction-glass-horizontal-dark.svg"),
);
const lightHorizontal = removeBackground(
  readBrandAsset("russelltech-quad-refraction-glass-horizontal-light.svg"),
);
const darkMark = readBrandAsset(
  "russelltech-quad-refraction-glass-mark-dark.svg",
);
const lightMark = readBrandAsset(
  "russelltech-quad-refraction-glass-mark-light.svg",
);

const writeText = (filename, contents) =>
  fs.writeFileSync(path.join(publicDirectory, filename), contents);

writeText("logo-on-dark.svg", darkHorizontal);
writeText("logo-on-light.svg", lightHorizontal);
writeText("logo.svg", lightHorizontal);
writeText("favicon-dark.svg", darkMark);
writeText("favicon-light.svg", lightMark);
writeText("favicon.svg", darkMark);

await sharp(Buffer.from(lightHorizontal))
  .resize({ width: 1440 })
  .png({ compressionLevel: 9 })
  .toFile(path.join(publicDirectory, "logo.png"));

const iconSizes = [16, 32, 48, 150, 180, 192, 512];
const iconBuffers = new Map();

for (const size of iconSizes) {
  iconBuffers.set(
    size,
    await sharp(Buffer.from(darkMark))
      .resize({ width: size, height: size })
      .png({ compressionLevel: 9 })
      .toBuffer(),
  );
}

fs.writeFileSync(
  path.join(publicDirectory, "favicon-16x16.png"),
  iconBuffers.get(16),
);
fs.writeFileSync(
  path.join(publicDirectory, "favicon-32x32.png"),
  iconBuffers.get(32),
);
fs.writeFileSync(
  path.join(publicDirectory, "apple-touch-icon.png"),
  iconBuffers.get(180),
);
fs.writeFileSync(
  path.join(publicDirectory, "android-chrome-192x192.png"),
  iconBuffers.get(192),
);
fs.writeFileSync(
  path.join(publicDirectory, "android-chrome-512x512.png"),
  iconBuffers.get(512),
);
fs.writeFileSync(
  path.join(publicDirectory, "mstile-150x150.png"),
  iconBuffers.get(150),
);

function createIco(images) {
  const header = Buffer.alloc(6);
  header.writeUInt16LE(0, 0);
  header.writeUInt16LE(1, 2);
  header.writeUInt16LE(images.length, 4);

  const entries = Buffer.alloc(images.length * 16);
  let offset = 6 + entries.length;

  images.forEach(({ size, buffer }, index) => {
    const entryOffset = index * 16;
    entries.writeUInt8(size >= 256 ? 0 : size, entryOffset);
    entries.writeUInt8(size >= 256 ? 0 : size, entryOffset + 1);
    entries.writeUInt8(0, entryOffset + 2);
    entries.writeUInt8(0, entryOffset + 3);
    entries.writeUInt16LE(1, entryOffset + 4);
    entries.writeUInt16LE(32, entryOffset + 6);
    entries.writeUInt32LE(buffer.length, entryOffset + 8);
    entries.writeUInt32LE(offset, entryOffset + 12);
    offset += buffer.length;
  });

  return Buffer.concat([
    header,
    entries,
    ...images.map(({ buffer }) => buffer),
  ]);
}

fs.writeFileSync(
  path.join(publicDirectory, "favicon.ico"),
  createIco(
    [16, 32, 48].map((size) => ({ size, buffer: iconBuffers.get(size) })),
  ),
);

writeText(
  "site.webmanifest",
  `${JSON.stringify(
    {
      name: "Russell Tech",
      short_name: "RussellTech",
      description:
        "Apps, websites and digital systems built for real businesses.",
      start_url: "/",
      display: "standalone",
      background_color: "#030914",
      theme_color: "#030914",
      icons: [
        {
          src: "/android-chrome-192x192.png",
          sizes: "192x192",
          type: "image/png",
          purpose: "any maskable",
        },
        {
          src: "/android-chrome-512x512.png",
          sizes: "512x512",
          type: "image/png",
          purpose: "any maskable",
        },
      ],
    },
    null,
    2,
  )}\n`,
);

writeText(
  "browserconfig.xml",
  `<?xml version="1.0" encoding="utf-8"?>
<browserconfig>
  <msapplication>
    <tile>
      <square150x150logo src="/mstile-150x150.png"/>
      <TileColor>#030914</TileColor>
    </tile>
  </msapplication>
</browserconfig>
`,
);

const embeddedLogo = Buffer.from(darkHorizontal).toString("base64");
const socialArtwork = `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="630" viewBox="0 0 1200 630" role="img" aria-labelledby="title description">
  <title id="title">Russell Tech</title>
  <desc id="description">Russell Tech logo and the words Apps, websites and digital systems built properly.</desc>
  <defs>
    <radialGradient id="cyanGlow" cx="0" cy="0" r="1" gradientTransform="translate(170 105) rotate(36) scale(590 390)" gradientUnits="userSpaceOnUse">
      <stop stop-color="#35D9FF" stop-opacity="0.32"/>
      <stop offset="1" stop-color="#35D9FF" stop-opacity="0"/>
    </radialGradient>
    <radialGradient id="purpleGlow" cx="0" cy="0" r="1" gradientTransform="translate(1080 560) rotate(-146) scale(620 420)" gradientUnits="userSpaceOnUse">
      <stop stop-color="#A94AF4" stop-opacity="0.34"/>
      <stop offset="1" stop-color="#A94AF4" stop-opacity="0"/>
    </radialGradient>
    <pattern id="grid" width="72" height="72" patternUnits="userSpaceOnUse">
      <path d="M72 0H0V72" fill="none" stroke="#FFFFFF" stroke-opacity="0.035"/>
    </pattern>
  </defs>
  <rect width="1200" height="630" fill="#030914"/>
  <rect width="1200" height="630" fill="url(#cyanGlow)"/>
  <rect width="1200" height="630" fill="url(#purpleGlow)"/>
  <rect width="1200" height="630" fill="url(#grid)"/>
  <image href="data:image/svg+xml;base64,${embeddedLogo}" x="52" y="130" width="1096" height="289"/>
  <text x="82" y="506" fill="#B8C2D8" font-family="Arial, Helvetica, sans-serif" font-size="30" font-weight="500" letter-spacing="0.2">Apps, websites and digital systems built properly.</text>
  <rect x="82" y="548" width="132" height="4" rx="2" fill="#42D8FF"/>
  <rect x="214" y="548" width="118" height="4" rx="2" fill="#5D67FF"/>
  <rect x="332" y="548" width="86" height="4" rx="2" fill="#A94AF4"/>
</svg>
`;

writeText("og-default.svg", socialArtwork);
await sharp(Buffer.from(socialArtwork))
  .png({ compressionLevel: 9 })
  .toFile(path.join(publicDirectory, "og-default.png"));
