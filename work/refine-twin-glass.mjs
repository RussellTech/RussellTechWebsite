import fs from "node:fs";
import path from "node:path";
import sharp from "sharp";

const sourceDirectory =
  "/Users/aaronrussell/Documents/Codex/2026-08-14/design-a-distinctive-modern-vector-logo/outputs";
const outputDirectory = path.resolve("public/brand");

const additions = `
    <linearGradient id="tech-gradient" x1="268" y1="38" x2="440" y2="94" gradientUnits="userSpaceOnUse">
      <stop offset="0" stop-color="#45D9FF"/>
      <stop offset="0.48" stop-color="#3279FF"/>
      <stop offset="1" stop-color="#A94AF4"/>
    </linearGradient>
    <linearGradient id="glass-left-v2" x1="18" y1="24" x2="116" y2="134" gradientUnits="userSpaceOnUse">
      <stop offset="0" stop-color="#A9F7FF" stop-opacity="0.5"/>
      <stop offset="0.26" stop-color="#41D8FF" stop-opacity="0.28"/>
      <stop offset="0.7" stop-color="#287DFF" stop-opacity="0.22"/>
      <stop offset="1" stop-color="#2654D9" stop-opacity="0.38"/>
    </linearGradient>
    <linearGradient id="glass-right-v2" x1="48" y1="22" x2="146" y2="136" gradientUnits="userSpaceOnUse">
      <stop offset="0" stop-color="#7EC9FF" stop-opacity="0.34"/>
      <stop offset="0.3" stop-color="#586FFF" stop-opacity="0.23"/>
      <stop offset="0.72" stop-color="#9D45EF" stop-opacity="0.28"/>
      <stop offset="1" stop-color="#F04BD9" stop-opacity="0.42"/>
    </linearGradient>
    <linearGradient id="overlap-refraction-v2" x1="55" y1="30" x2="112" y2="132" gradientUnits="userSpaceOnUse">
      <stop offset="0" stop-color="#5DF6FF" stop-opacity="0.58"/>
      <stop offset="0.34" stop-color="#37C9FF" stop-opacity="0.48"/>
      <stop offset="0.58" stop-color="#FF47D7" stop-opacity="0.72"/>
      <stop offset="0.82" stop-color="#BE3DFF" stop-opacity="0.62"/>
      <stop offset="1" stop-color="#754BFF" stop-opacity="0.46"/>
    </linearGradient>
    <linearGradient id="third-pane-v3" x1="48" y1="16" x2="116" y2="143" gradientUnits="userSpaceOnUse">
      <stop offset="0" stop-color="#43F1D4" stop-opacity="0.46"/>
      <stop offset="0.3" stop-color="#42C8FF" stop-opacity="0.28"/>
      <stop offset="0.62" stop-color="#FF55C9" stop-opacity="0.34"/>
      <stop offset="1" stop-color="#FF6D8E" stop-opacity="0.46"/>
    </linearGradient>
    <linearGradient id="third-edge-density-v3" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0" stop-color="#43F1D4" stop-opacity="0.5"/>
      <stop offset="0.28" stop-color="#43F1D4" stop-opacity="0"/>
      <stop offset="0.7" stop-color="#FF55C9" stop-opacity="0"/>
      <stop offset="1" stop-color="#FF6D8E" stop-opacity="0.48"/>
    </linearGradient>
    <radialGradient id="third-volume-v3" cx="0.34" cy="0.22" r="0.9">
      <stop offset="0" stop-color="#82FFE5" stop-opacity="0.5"/>
      <stop offset="0.44" stop-color="#42C8FF" stop-opacity="0.18"/>
      <stop offset="0.78" stop-color="#FF55C9" stop-opacity="0.13"/>
      <stop offset="1" stop-color="#FF6D8E" stop-opacity="0"/>
    </radialGradient>
    <linearGradient id="triple-refraction-v3" x1="54" y1="30" x2="111" y2="128" gradientUnits="userSpaceOnUse">
      <stop offset="0" stop-color="#3AF5D1" stop-opacity="0.72"/>
      <stop offset="0.28" stop-color="#4BDBFF" stop-opacity="0.66"/>
      <stop offset="0.55" stop-color="#D65DFF" stop-opacity="0.7"/>
      <stop offset="0.8" stop-color="#FF4FC7" stop-opacity="0.78"/>
      <stop offset="1" stop-color="#FF7689" stop-opacity="0.68"/>
    </linearGradient>
    <linearGradient id="fourth-pane-v4" x1="21" y1="52" x2="145" y2="105" gradientUnits="userSpaceOnUse">
      <stop offset="0" stop-color="#77FFC0" stop-opacity="0.45"/>
      <stop offset="0.32" stop-color="#45EBD7" stop-opacity="0.3"/>
      <stop offset="0.68" stop-color="#FFD166" stop-opacity="0.34"/>
      <stop offset="1" stop-color="#FF8A62" stop-opacity="0.46"/>
    </linearGradient>
    <linearGradient id="fourth-edge-density-v4" x1="0" y1="0" x2="1" y2="0">
      <stop offset="0" stop-color="#77FFC0" stop-opacity="0.52"/>
      <stop offset="0.23" stop-color="#77FFC0" stop-opacity="0"/>
      <stop offset="0.76" stop-color="#FFD166" stop-opacity="0"/>
      <stop offset="1" stop-color="#FF8A62" stop-opacity="0.5"/>
    </linearGradient>
    <radialGradient id="fourth-volume-v4" cx="0.24" cy="0.36" r="0.92">
      <stop offset="0" stop-color="#B4FFDA" stop-opacity="0.52"/>
      <stop offset="0.42" stop-color="#45EBD7" stop-opacity="0.18"/>
      <stop offset="0.76" stop-color="#FFD166" stop-opacity="0.14"/>
      <stop offset="1" stop-color="#FF8A62" stop-opacity="0"/>
    </radialGradient>
    <linearGradient id="quad-refraction-v4" x1="44" y1="50" x2="121" y2="106" gradientUnits="userSpaceOnUse">
      <stop offset="0" stop-color="#7CFFC4" stop-opacity="0.8"/>
      <stop offset="0.26" stop-color="#42F0DA" stop-opacity="0.72"/>
      <stop offset="0.5" stop-color="#5CD7FF" stop-opacity="0.7"/>
      <stop offset="0.73" stop-color="#FFD166" stop-opacity="0.78"/>
      <stop offset="1" stop-color="#FF7B6B" stop-opacity="0.76"/>
    </linearGradient>
    <radialGradient id="left-volume-v2" cx="0.22" cy="0.16" r="0.92">
      <stop offset="0" stop-color="#C8FCFF" stop-opacity="0.48"/>
      <stop offset="0.42" stop-color="#48DFFF" stop-opacity="0.18"/>
      <stop offset="1" stop-color="#256CFF" stop-opacity="0"/>
    </radialGradient>
    <radialGradient id="right-volume-v2" cx="0.82" cy="0.88" r="0.9">
      <stop offset="0" stop-color="#FF65DE" stop-opacity="0.5"/>
      <stop offset="0.46" stop-color="#A34CFA" stop-opacity="0.17"/>
      <stop offset="1" stop-color="#695AFF" stop-opacity="0"/>
    </radialGradient>
    <radialGradient id="overlap-bloom-v2" cx="0.48" cy="0.38" r="0.72">
      <stop offset="0" stop-color="#FF79E5" stop-opacity="0.64"/>
      <stop offset="0.32" stop-color="#7DEBFF" stop-opacity="0.34"/>
      <stop offset="0.7" stop-color="#8D42FF" stop-opacity="0.16"/>
      <stop offset="1" stop-color="#8D42FF" stop-opacity="0"/>
    </radialGradient>
    <linearGradient id="left-edge-density-v2" x1="0" y1="0" x2="1" y2="0">
      <stop offset="0" stop-color="#45E2FF" stop-opacity="0.46"/>
      <stop offset="0.24" stop-color="#45E2FF" stop-opacity="0"/>
      <stop offset="0.8" stop-color="#307CFF" stop-opacity="0"/>
      <stop offset="1" stop-color="#307CFF" stop-opacity="0.34"/>
    </linearGradient>
    <linearGradient id="right-edge-density-v2" x1="0" y1="0" x2="1" y2="0">
      <stop offset="0" stop-color="#688DFF" stop-opacity="0.34"/>
      <stop offset="0.2" stop-color="#688DFF" stop-opacity="0"/>
      <stop offset="0.78" stop-color="#E650DD" stop-opacity="0"/>
      <stop offset="1" stop-color="#E650DD" stop-opacity="0.42"/>
    </linearGradient>
    <filter id="pane-ambient-v2" x="-60%" y="-60%" width="220%" height="220%" color-interpolation-filters="sRGB">
      <feGaussianBlur stdDeviation="8"/>
    </filter>
    <filter id="volume-soft-v2" x="-55%" y="-55%" width="210%" height="210%" color-interpolation-filters="sRGB">
      <feGaussianBlur stdDeviation="7"/>
    </filter>
    <filter id="refraction-soft-v2" x="-60%" y="-60%" width="220%" height="220%" color-interpolation-filters="sRGB">
      <feGaussianBlur stdDeviation="4.5"/>
    </filter>
    <clipPath id="left-pane-v2"><rect x="13" y="24" width="101" height="108" rx="35" transform="rotate(-9 63.5 78)"/></clipPath>
    <clipPath id="right-pane-v2"><rect x="46" y="24" width="101" height="108" rx="35" transform="rotate(9 96.5 78)"/></clipPath>
    <clipPath id="third-pane-clip-v3"><rect x="54" y="14" width="55" height="129" rx="27" transform="rotate(24 81.5 78.5)"/></clipPath>
    <clipPath id="fourth-pane-clip-v4"><rect x="20" y="56" width="124" height="46" rx="23" transform="rotate(-18 82 79)"/></clipPath>
`;

const oldGlassDefinitions = /\s*<linearGradient id="cyan-pane"[\s\S]*?<clipPath id="right-pane-clip">[\s\S]*?<\/clipPath>/;

const rtGlyphs =
  '<use href="#rt-glyph-0-0" x="0" y="70.203125"/><use href="#rt-glyph-0-1" x="50.6875" y="70.203125"/>';
const techGlyphs =
  '<use href="#glyph-0-5" x="268.3125" y="78" fill="#45D9FF"/><use href="#glyph-0-3" x="306.875" y="78" fill="#318FFF"/><use href="#glyph-0-6" x="351.359375" y="78" fill="#5D67FF"/><use href="#glyph-0-7" x="395.84375" y="78" fill="#A94AF4"/>';

function glassMark(dark) {
  const rtFill = dark ? "#F7FAFF" : "#07101F";
  const ambientOpacity = dark ? 0.22 : 0.13;
  const paneOpacity = dark ? 1 : 0.88;
  const overlapOpacity = dark ? 0.9 : 0.62;

  return `<g>
    <g opacity="${ambientOpacity}" filter="url(#pane-ambient-v2)">
      <rect x="13" y="24" width="101" height="108" rx="35" transform="rotate(-9 63.5 78)" fill="#26CFFF"/>
      <rect x="46" y="24" width="101" height="108" rx="35" transform="rotate(9 96.5 78)" fill="#C446F4"/>
    </g>

    <rect x="13" y="24" width="101" height="108" rx="35" transform="rotate(-9 63.5 78)" fill="url(#glass-left-v2)" opacity="${paneOpacity}"/>
    <g clip-path="url(#left-pane-v2)">
      <ellipse cx="31" cy="31" rx="71" ry="65" fill="url(#left-volume-v2)" filter="url(#volume-soft-v2)"/>
      <rect x="4" y="18" width="121" height="123" fill="url(#left-edge-density-v2)" opacity="0.54"/>
      <ellipse cx="98" cy="122" rx="49" ry="39" fill="#2E6FFF" opacity="0.1" filter="url(#volume-soft-v2)"/>
    </g>

    <rect x="46" y="24" width="101" height="108" rx="35" transform="rotate(9 96.5 78)" fill="url(#glass-right-v2)" opacity="${paneOpacity}"/>
    <g clip-path="url(#right-pane-v2)">
      <ellipse cx="132" cy="124" rx="69" ry="61" fill="url(#right-volume-v2)" filter="url(#volume-soft-v2)"/>
      <rect x="38" y="18" width="121" height="123" fill="url(#right-edge-density-v2)" opacity="0.58"/>
      <ellipse cx="64" cy="34" rx="50" ry="36" fill="#4E8DFF" opacity="0.1" filter="url(#volume-soft-v2)"/>
    </g>

    <g clip-path="url(#left-pane-v2)">
      <g clip-path="url(#right-pane-v2)">
        <rect x="35" y="15" width="94" height="130" fill="url(#overlap-refraction-v2)" opacity="${overlapOpacity}"/>
        <ellipse cx="84" cy="67" rx="37" ry="57" fill="url(#overlap-bloom-v2)" filter="url(#refraction-soft-v2)"/>
        <ellipse cx="63" cy="61" rx="12" ry="48" fill="#5FF3FF" opacity="${dark ? 0.26 : 0.18}" filter="url(#refraction-soft-v2)"/>
        <ellipse cx="104" cy="86" rx="13" ry="50" fill="#FF49D8" opacity="${dark ? 0.34 : 0.23}" filter="url(#refraction-soft-v2)"/>
      </g>
    </g>
  </g>
  <g transform="translate(30 38) scale(1.06)" fill="${rtFill}">${rtGlyphs}</g>`;
}

function glassMarkBehind(dark, alwaysDark = false, extraPane = false, fourthPane = false) {
  const rtFill = alwaysDark ? "#07101F" : dark ? "#F7FAFF" : "#07101F";
  const ambientOpacity = dark ? 0.22 : 0.13;
  const paneOpacity = dark ? 1 : 0.88;
  const overlapOpacity = dark ? 0.9 : 0.62;
  const leftRefractionOpacity = alwaysDark ? (dark ? 0.74 : 0.58) : dark ? 0.34 : 0.22;
  const rightRefractionOpacity = alwaysDark ? (dark ? 0.78 : 0.62) : dark ? 0.38 : 0.24;
  const leftRefraction = alwaysDark
    ? `<g transform="translate(27.4 37.9) scale(1.083 1.06)" fill="#58EEFF" opacity="${dark ? 0.22 : 0.16}">${rtGlyphs}</g>
      <g transform="translate(29.4 38.1) scale(1.068 1.06)" fill="#07101F" opacity="${leftRefractionOpacity}">${rtGlyphs}</g>`
    : `<g transform="translate(28.7 38.1) scale(1.072 1.06)" fill="#62EFFF" opacity="${leftRefractionOpacity}">${rtGlyphs}</g>`;
  const rightRefraction = alwaysDark
    ? `<g transform="translate(32.8 38.4) scale(1.035 1.06)" fill="#F04BDB" opacity="${dark ? 0.26 : 0.18}">${rtGlyphs}</g>
      <g transform="translate(30.7 38.2) scale(1.052 1.06)" fill="#07101F" opacity="${rightRefractionOpacity}">${rtGlyphs}</g>`
    : `<g transform="translate(31.1 38.2) scale(1.045 1.06)" fill="#D64DFF" opacity="${rightRefractionOpacity}">${rtGlyphs}</g>`;
  const overlapLetterRefraction = alwaysDark
    ? `<g transform="translate(26.4 37.5) scale(1.098 1.06)" fill="#5CF4FF" opacity="${dark ? 0.48 : 0.34}">${rtGlyphs}</g>
        <g transform="translate(34 38.7) scale(1.024 1.06)" fill="#FF45D5" opacity="${dark ? 0.62 : 0.44}">${rtGlyphs}</g>
        <g transform="translate(30.1 38.15) scale(1.064 1.06)" fill="#07101F" opacity="${dark ? 0.93 : 0.88}">${rtGlyphs}</g>`
    : `<g transform="translate(27.8 37.7) scale(1.088 1.06)" fill="#64F4FF" opacity="${dark ? 0.36 : 0.25}">${rtGlyphs}</g>
        <g transform="translate(32.1 38.5) scale(1.038 1.06)" fill="#FF4EDB" opacity="${dark ? 0.5 : 0.34}">${rtGlyphs}</g>`;

  return `<g>
    <g opacity="${ambientOpacity}" filter="url(#pane-ambient-v2)">
      <rect x="13" y="24" width="101" height="108" rx="35" transform="rotate(-9 63.5 78)" fill="#26CFFF"/>
      <rect x="46" y="24" width="101" height="108" rx="35" transform="rotate(9 96.5 78)" fill="#C446F4"/>
      ${extraPane ? '<rect x="54" y="14" width="55" height="129" rx="27" transform="rotate(24 81.5 78.5)" fill="#FF4FC7" opacity="0.72"/>' : ""}
      ${fourthPane ? '<rect x="20" y="56" width="124" height="46" rx="23" transform="rotate(-18 82 79)" fill="#FFD166" opacity="0.65"/>' : ""}
    </g>

    <g transform="translate(30 38) scale(1.06)" fill="${rtFill}" opacity="${alwaysDark ? 1 : 0.94}">${rtGlyphs}</g>

    <rect x="13" y="24" width="101" height="108" rx="35" transform="rotate(-9 63.5 78)" fill="url(#glass-left-v2)" opacity="${paneOpacity}"/>
    <g clip-path="url(#left-pane-v2)">
      <ellipse cx="31" cy="31" rx="71" ry="65" fill="url(#left-volume-v2)" filter="url(#volume-soft-v2)"/>
      <rect x="4" y="18" width="121" height="123" fill="url(#left-edge-density-v2)" opacity="0.54"/>
      <ellipse cx="98" cy="122" rx="49" ry="39" fill="#2E6FFF" opacity="0.1" filter="url(#volume-soft-v2)"/>
      ${alwaysDark ? `<ellipse cx="49" cy="70" rx="57" ry="69" fill="#6CEAFF" opacity="${dark ? 0.1 : 0.07}" filter="url(#volume-soft-v2)"/>` : ""}
      ${leftRefraction}
    </g>

    <rect x="46" y="24" width="101" height="108" rx="35" transform="rotate(9 96.5 78)" fill="url(#glass-right-v2)" opacity="${paneOpacity}"/>
    <g clip-path="url(#right-pane-v2)">
      <ellipse cx="132" cy="124" rx="69" ry="61" fill="url(#right-volume-v2)" filter="url(#volume-soft-v2)"/>
      <rect x="38" y="18" width="121" height="123" fill="url(#right-edge-density-v2)" opacity="0.58"/>
      <ellipse cx="64" cy="34" rx="50" ry="36" fill="#4E8DFF" opacity="0.1" filter="url(#volume-soft-v2)"/>
      ${alwaysDark ? `<ellipse cx="113" cy="84" rx="55" ry="67" fill="#C965FF" opacity="${dark ? 0.1 : 0.07}" filter="url(#volume-soft-v2)"/>` : ""}
      ${rightRefraction}
    </g>

    <g clip-path="url(#left-pane-v2)">
      <g clip-path="url(#right-pane-v2)">
        <rect x="35" y="15" width="94" height="130" fill="url(#overlap-refraction-v2)" opacity="${overlapOpacity}"/>
        <ellipse cx="84" cy="67" rx="37" ry="57" fill="url(#overlap-bloom-v2)" filter="url(#refraction-soft-v2)"/>
        <ellipse cx="63" cy="61" rx="12" ry="48" fill="#5FF3FF" opacity="${dark ? 0.26 : 0.18}" filter="url(#refraction-soft-v2)"/>
        <ellipse cx="104" cy="86" rx="13" ry="50" fill="#FF49D8" opacity="${dark ? 0.34 : 0.23}" filter="url(#refraction-soft-v2)"/>
        ${overlapLetterRefraction}
      </g>
    </g>
    ${
      extraPane
        ? `<rect x="54" y="14" width="55" height="129" rx="27" transform="rotate(24 81.5 78.5)" fill="url(#third-pane-v3)" opacity="${dark ? 0.9 : 0.72}"/>
    <g clip-path="url(#third-pane-clip-v3)">
      <ellipse cx="67" cy="39" rx="48" ry="69" fill="url(#third-volume-v3)" filter="url(#volume-soft-v2)"/>
      <rect x="42" y="7" width="82" height="144" fill="url(#third-edge-density-v3)" opacity="0.6"/>
      <g transform="translate(25.5 37.4) scale(1.105 1.06)" fill="#3BF3D0" opacity="${dark ? 0.42 : 0.3}">${rtGlyphs}</g>
      <g transform="translate(35 38.9) scale(1.016 1.06)" fill="#FF5B91" opacity="${dark ? 0.52 : 0.38}">${rtGlyphs}</g>
      <g transform="translate(30.3 38.2) scale(1.062 1.06)" fill="#07101F" opacity="${dark ? 0.9 : 0.86}">${rtGlyphs}</g>
    </g>
    <g clip-path="url(#left-pane-v2)">
      <g clip-path="url(#right-pane-v2)">
        <g clip-path="url(#third-pane-clip-v3)">
          <rect x="42" y="12" width="85" height="136" fill="url(#triple-refraction-v3)" opacity="${dark ? 0.82 : 0.62}"/>
          <g transform="translate(24.8 37.2) scale(1.112 1.06)" fill="#39F4D0" opacity="${dark ? 0.5 : 0.36}">${rtGlyphs}</g>
          <g transform="translate(35.8 39) scale(1.01 1.06)" fill="#FF578D" opacity="${dark ? 0.64 : 0.46}">${rtGlyphs}</g>
          <g transform="translate(30.2 38.15) scale(1.066 1.06)" fill="#07101F" opacity="0.95">${rtGlyphs}</g>
        </g>
      </g>
    </g>`
        : ""
    }
    ${
      fourthPane
        ? `<rect x="20" y="56" width="124" height="46" rx="23" transform="rotate(-18 82 79)" fill="url(#fourth-pane-v4)" opacity="${dark ? 0.88 : 0.7}"/>
    <g clip-path="url(#fourth-pane-clip-v4)">
      <ellipse cx="52" cy="71" rx="70" ry="43" fill="url(#fourth-volume-v4)" filter="url(#volume-soft-v2)"/>
      <rect x="12" y="48" width="142" height="63" fill="url(#fourth-edge-density-v4)" opacity="0.62"/>
      <g transform="translate(24.2 36.9) scale(1.118 1.078)" fill="#73FFC0" opacity="${dark ? 0.46 : 0.32}">${rtGlyphs}</g>
      <g transform="translate(36.2 39.4) scale(1.006 1.044)" fill="#FFD166" opacity="${dark ? 0.56 : 0.4}">${rtGlyphs}</g>
      <g transform="translate(30.2 38.15) scale(1.067 1.06)" fill="#07101F" opacity="${dark ? 0.92 : 0.88}">${rtGlyphs}</g>
    </g>
    <g clip-path="url(#left-pane-v2)">
      <g clip-path="url(#right-pane-v2)">
        <g clip-path="url(#third-pane-clip-v3)">
          <g clip-path="url(#fourth-pane-clip-v4)">
            <rect x="35" y="44" width="96" height="75" fill="url(#quad-refraction-v4)" opacity="${dark ? 0.9 : 0.68}"/>
            <g transform="translate(22.8 36.6) scale(1.13 1.08)" fill="#76FFC3" opacity="${dark ? 0.54 : 0.38}">${rtGlyphs}</g>
            <g transform="translate(37.2 39.7) scale(0.996 1.04)" fill="#FFD166" opacity="${dark ? 0.66 : 0.48}">${rtGlyphs}</g>
            <g transform="translate(30.15 38.1) scale(1.068 1.06)" fill="#07101F" opacity="0.96">${rtGlyphs}</g>
          </g>
        </g>
      </g>
    </g>`
        : ""
    }
  </g>`;
}

function prepare(source, dark, kind, mode = "front") {
  let svg = source.replace(oldGlassDefinitions, "");
  svg = svg.replace("</defs>", `${additions}\n  </defs>`);
  svg = svg.replace(
    "Two overlapping liquid-glass panes frame a bold RT monogram beside the RussellTech wordmark.",
    "Two translucent cyan and violet glass panes create a spectral refracted colour where they overlap, framing a bold RT monogram beside the RussellTech wordmark.",
  );
  svg = svg.replace(
    "Two overlapping cyan and violet liquid-glass panes with a bold RT monogram.",
    "Two translucent cyan and violet glass panes create a spectral refracted colour where they overlap around a bold RT monogram.",
  );
  svg = svg.replace(
    '<rect x="484" y="54" width="190" height="94" fill="url(#tech-gradient)" mask="url(#tech-mask)"/>',
    `<g transform="translate(220 46)" fill="url(#tech-gradient)">${techGlyphs}</g>`,
  );
  if (
    mode === "behind" ||
    mode === "dark-rt" ||
    mode === "multi-refraction" ||
    mode === "quad-refraction"
  ) {
    svg = svg
      .replace("RussellTech Twin Glass logo", "RussellTech Behind Glass logo")
      .replace("RussellTech Twin Glass RT mark", "RussellTech Behind Glass RT mark")
      .replace(
        "Two translucent cyan and violet glass panes create a spectral refracted colour where they overlap, framing a bold RT monogram beside the RussellTech wordmark.",
        "A bold RT monogram sits behind two translucent cyan and violet glass panes, splitting into spectral colour through their overlap beside the RussellTech wordmark.",
      )
      .replace(
        "Two translucent cyan and violet glass panes create a spectral refracted colour where they overlap around a bold RT monogram.",
        "A bold RT monogram sits behind two translucent cyan and violet glass panes and splits into spectral colour through their overlap.",
      );
  }

  if (kind === "horizontal") {
    const start = svg.indexOf('  <g transform="translate(16 17)">');
    const end = svg.indexOf('  <g transform="translate(220 46)"', start);
    if (start < 0 || end < 0) throw new Error("Horizontal logo body not found");
    const markArtwork =
      mode === "quad-refraction"
        ? glassMarkBehind(dark, true, true, true)
        : mode === "multi-refraction"
        ? glassMarkBehind(dark, true, true)
        : mode === "dark-rt"
        ? glassMarkBehind(dark, true)
        : mode === "behind"
          ? glassMarkBehind(dark)
          : glassMark(dark);
    return `${svg.slice(0, start)}  <g transform="translate(16 17)">${markArtwork}</g>\n${svg.slice(end)}`;
  }

  const start = svg.indexOf('  <g transform="translate(8 10)">');
  const end = svg.lastIndexOf("</svg>");
  if (start < 0 || end < 0) throw new Error("Mark body not found");
  const markArtwork =
    mode === "quad-refraction"
      ? glassMarkBehind(dark, true, true, true)
      : mode === "multi-refraction"
      ? glassMarkBehind(dark, true, true)
      : mode === "dark-rt"
      ? glassMarkBehind(dark, true)
      : mode === "behind"
        ? glassMarkBehind(dark)
        : glassMark(dark);
  return `${svg.slice(0, start)}  <g transform="translate(8 10)">${markArtwork}</g>\n</svg>\n`;
}

const jobs = [
  {
    source: "russelltech-twin-glass-horizontal-dark.svg",
    output: "russelltech-refractive-glass-horizontal-dark.svg",
    dark: true,
    kind: "horizontal",
    png: "russelltech-refractive-glass-horizontal-dark.png",
    width: 1800,
  },
  {
    source: "russelltech-twin-glass-horizontal-light.svg",
    output: "russelltech-refractive-glass-horizontal-light.svg",
    dark: false,
    kind: "horizontal",
    png: "russelltech-refractive-glass-horizontal-light.png",
    width: 1800,
  },
  {
    source: "russelltech-twin-glass-mark-dark.svg",
    output: "russelltech-refractive-glass-mark-dark.svg",
    dark: true,
    kind: "mark",
    png: "russelltech-refractive-glass-mark-512.png",
    width: 512,
  },
  {
    source: "russelltech-twin-glass-mark-light.svg",
    output: "russelltech-refractive-glass-mark-light.svg",
    dark: false,
    kind: "mark",
    png: "russelltech-refractive-glass-mark-light-512.png",
    width: 512,
  },
  {
    source: "russelltech-twin-glass-horizontal-dark.svg",
    output: "russelltech-behind-glass-horizontal-dark.svg",
    dark: true,
    kind: "horizontal",
    mode: "behind",
    png: "russelltech-behind-glass-horizontal-dark.png",
    width: 1800,
  },
  {
    source: "russelltech-twin-glass-horizontal-light.svg",
    output: "russelltech-behind-glass-horizontal-light.svg",
    dark: false,
    kind: "horizontal",
    mode: "behind",
    png: "russelltech-behind-glass-horizontal-light.png",
    width: 1800,
  },
  {
    source: "russelltech-twin-glass-mark-dark.svg",
    output: "russelltech-behind-glass-mark-dark.svg",
    dark: true,
    kind: "mark",
    mode: "behind",
    png: "russelltech-behind-glass-mark-512.png",
    width: 512,
  },
  {
    source: "russelltech-twin-glass-mark-light.svg",
    output: "russelltech-behind-glass-mark-light.svg",
    dark: false,
    kind: "mark",
    mode: "behind",
    png: "russelltech-behind-glass-mark-light-512.png",
    width: 512,
  },
  {
    source: "russelltech-twin-glass-horizontal-dark.svg",
    output: "russelltech-dark-rt-glass-horizontal-dark.svg",
    dark: true,
    kind: "horizontal",
    mode: "dark-rt",
    png: "russelltech-dark-rt-glass-horizontal-dark.png",
    width: 1800,
  },
  {
    source: "russelltech-twin-glass-horizontal-light.svg",
    output: "russelltech-dark-rt-glass-horizontal-light.svg",
    dark: false,
    kind: "horizontal",
    mode: "dark-rt",
    png: "russelltech-dark-rt-glass-horizontal-light.png",
    width: 1800,
  },
  {
    source: "russelltech-twin-glass-mark-dark.svg",
    output: "russelltech-dark-rt-glass-mark-dark.svg",
    dark: true,
    kind: "mark",
    mode: "dark-rt",
    png: "russelltech-dark-rt-glass-mark-512.png",
    width: 512,
  },
  {
    source: "russelltech-twin-glass-mark-light.svg",
    output: "russelltech-dark-rt-glass-mark-light.svg",
    dark: false,
    kind: "mark",
    mode: "dark-rt",
    png: "russelltech-dark-rt-glass-mark-light-512.png",
    width: 512,
  },
  {
    source: "russelltech-twin-glass-horizontal-dark.svg",
    output: "russelltech-multi-refraction-glass-horizontal-dark.svg",
    dark: true,
    kind: "horizontal",
    mode: "multi-refraction",
    png: "russelltech-multi-refraction-glass-horizontal-dark.png",
    width: 1800,
  },
  {
    source: "russelltech-twin-glass-horizontal-light.svg",
    output: "russelltech-multi-refraction-glass-horizontal-light.svg",
    dark: false,
    kind: "horizontal",
    mode: "multi-refraction",
    png: "russelltech-multi-refraction-glass-horizontal-light.png",
    width: 1800,
  },
  {
    source: "russelltech-twin-glass-mark-dark.svg",
    output: "russelltech-multi-refraction-glass-mark-dark.svg",
    dark: true,
    kind: "mark",
    mode: "multi-refraction",
    png: "russelltech-multi-refraction-glass-mark-512.png",
    width: 512,
  },
  {
    source: "russelltech-twin-glass-mark-light.svg",
    output: "russelltech-multi-refraction-glass-mark-light.svg",
    dark: false,
    kind: "mark",
    mode: "multi-refraction",
    png: "russelltech-multi-refraction-glass-mark-light-512.png",
    width: 512,
  },
  {
    source: "russelltech-twin-glass-horizontal-dark.svg",
    output: "russelltech-quad-refraction-glass-horizontal-dark.svg",
    dark: true,
    kind: "horizontal",
    mode: "quad-refraction",
    png: "russelltech-quad-refraction-glass-horizontal-dark.png",
    width: 1800,
  },
  {
    source: "russelltech-twin-glass-horizontal-light.svg",
    output: "russelltech-quad-refraction-glass-horizontal-light.svg",
    dark: false,
    kind: "horizontal",
    mode: "quad-refraction",
    png: "russelltech-quad-refraction-glass-horizontal-light.png",
    width: 1800,
  },
  {
    source: "russelltech-twin-glass-mark-dark.svg",
    output: "russelltech-quad-refraction-glass-mark-dark.svg",
    dark: true,
    kind: "mark",
    mode: "quad-refraction",
    png: "russelltech-quad-refraction-glass-mark-512.png",
    width: 512,
  },
  {
    source: "russelltech-twin-glass-mark-light.svg",
    output: "russelltech-quad-refraction-glass-mark-light.svg",
    dark: false,
    kind: "mark",
    mode: "quad-refraction",
    png: "russelltech-quad-refraction-glass-mark-light-512.png",
    width: 512,
  },
];

fs.mkdirSync(outputDirectory, { recursive: true });

for (const job of jobs) {
  const source = fs.readFileSync(path.join(sourceDirectory, job.source), "utf8");
  const result = prepare(source, job.dark, job.kind, job.mode);
  const svgPath = path.join(outputDirectory, job.output);
  fs.writeFileSync(svgPath, result);
  await sharp(Buffer.from(result)).resize({ width: job.width }).png().toFile(path.join(outputDirectory, job.png));
}

const darkMark = fs.readFileSync(
  path.join(outputDirectory, "russelltech-refractive-glass-mark-dark.svg"),
);
await sharp(darkMark)
  .resize({ width: 32, height: 32 })
  .png()
  .toFile(path.join(outputDirectory, "russelltech-refractive-glass-mark-32.png"));

const behindDarkMark = fs.readFileSync(
  path.join(outputDirectory, "russelltech-behind-glass-mark-dark.svg"),
);
await sharp(behindDarkMark)
  .resize({ width: 32, height: 32 })
  .png()
  .toFile(path.join(outputDirectory, "russelltech-behind-glass-mark-32.png"));

const darkRtMark = fs.readFileSync(
  path.join(outputDirectory, "russelltech-dark-rt-glass-mark-dark.svg"),
);
await sharp(darkRtMark)
  .resize({ width: 32, height: 32 })
  .png()
  .toFile(path.join(outputDirectory, "russelltech-dark-rt-glass-mark-32.png"));

const multiRefractionMark = fs.readFileSync(
  path.join(outputDirectory, "russelltech-multi-refraction-glass-mark-dark.svg"),
);
await sharp(multiRefractionMark)
  .resize({ width: 32, height: 32 })
  .png()
  .toFile(path.join(outputDirectory, "russelltech-multi-refraction-glass-mark-32.png"));

const quadRefractionMark = fs.readFileSync(
  path.join(outputDirectory, "russelltech-quad-refraction-glass-mark-dark.svg"),
);
await sharp(quadRefractionMark)
  .resize({ width: 32, height: 32 })
  .png()
  .toFile(path.join(outputDirectory, "russelltech-quad-refraction-glass-mark-32.png"));
