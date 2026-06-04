import fs from "node:fs/promises";
import path from "node:path";

const qrPngPath = path.resolve("assets/qr/saeed-portfolio-qr.png");
const qrPngBase64 = await fs.readFile(qrPngPath, "base64");

const cardSvg = `<?xml version="1.0" encoding="UTF-8"?>
<svg width="1200" height="1600" viewBox="0 0 1200 1600" fill="none" xmlns="http://www.w3.org/2000/svg">
  <rect width="1200" height="1600" fill="#111111"/>
  <rect x="52" y="52" width="1096" height="1496" fill="#151915" stroke="#344032" stroke-width="8"/>
  <rect x="86" y="86" width="1028" height="112" fill="#0F120F" stroke="#344032" stroke-width="6"/>
  <text x="118" y="156" fill="#C4FF4D" font-size="42" font-family="'Courier New', monospace" font-weight="700">SAEED.EXE</text>
  <text x="866" y="156" fill="#FFBF47" font-size="28" font-family="'Courier New', monospace">SCAN TO OPEN</text>

  <text x="118" y="280" fill="#FFBF47" font-size="30" font-family="'Courier New', monospace">PIXEL PORTFOLIO / PROJECT TAG</text>
  <text x="118" y="420" fill="#F5F0DD" font-size="116" font-family="Arial, sans-serif" font-weight="700">Ahmed</text>
  <text x="118" y="532" fill="#F5F0DD" font-size="116" font-family="Arial, sans-serif" font-weight="700">Saeed</text>
  <text x="118" y="660" fill="#C4FF4D" font-size="110" font-family="Arial, sans-serif" font-weight="700">aka Saeed</text>
  <text x="118" y="740" fill="#D1CAB1" font-size="42" font-family="Arial, sans-serif">Innovation University / Second-year student</text>

  <rect x="118" y="818" width="410" height="236" fill="#1D241B" stroke="#344032" stroke-width="6"/>
  <text x="146" y="866" fill="#FFBF47" font-size="24" font-family="'Courier New', monospace">ABOUT</text>
  <text x="146" y="926" fill="#F5F0DD" font-size="38" font-family="Arial, sans-serif">Visual work that aims</text>
  <text x="146" y="978" fill="#F5F0DD" font-size="38" font-family="Arial, sans-serif">to be honest, useful,</text>
  <text x="146" y="1030" fill="#F5F0DD" font-size="38" font-family="Arial, sans-serif">and purposeful.</text>

  <rect x="560" y="818" width="554" height="554" fill="#1D241B" stroke="#495845" stroke-width="8"/>
  <image href="data:image/png;base64,${qrPngBase64}" x="650" y="876" width="374" height="374"/>
  <rect x="626" y="1298" width="422" height="42" fill="#0F120F" stroke="#344032" stroke-width="4"/>
  <text x="650" y="1327" fill="#F5F0DD" font-size="22" font-family="'Courier New', monospace">ahmedsaeedq11-arch.github.io/SaeeedZzzz/</text>

  <rect x="118" y="1090" width="410" height="282" fill="#1D241B" stroke="#344032" stroke-width="6"/>
  <text x="146" y="1140" fill="#FFBF47" font-size="24" font-family="'Courier New', monospace">SOCIALS</text>
  <text x="146" y="1204" fill="#C4FF4D" font-size="34" font-family="'Courier New', monospace">LINKEDIN</text>
  <text x="146" y="1246" fill="#F5F0DD" font-size="24" font-family="Arial, sans-serif">Ahmed Saeed</text>
  <text x="146" y="1304" fill="#C4FF4D" font-size="34" font-family="'Courier New', monospace">BEHANCE / INSTAGRAM</text>
  <text x="146" y="1346" fill="#F5F0DD" font-size="24" font-family="Arial, sans-serif">ahmedsaeed375 / ahmed_saeed2_0</text>

  <rect x="86" y="1440" width="1028" height="74" fill="#0F120F" stroke="#344032" stroke-width="6"/>
  <text x="118" y="1488" fill="#FFBF47" font-size="26" font-family="'Courier New', monospace">Built for physical project presentation / Ready for print and scan</text>
</svg>`;

await fs.writeFile(path.resolve("assets/qr/saeed-qr-card.svg"), cardSvg, "utf8");
