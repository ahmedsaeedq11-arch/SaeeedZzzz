import fs from "node:fs/promises";
import path from "node:path";
import QRCode from "qrcode";

const url = "https://ahmedsaeedq11-arch.github.io/SaeeedZzzz/";
const outputDir = path.resolve("assets/qr");

await fs.mkdir(outputDir, { recursive: true });

await QRCode.toFile(path.join(outputDir, "saeed-portfolio-qr.png"), url, {
  errorCorrectionLevel: "H",
  margin: 2,
  width: 720,
  color: {
    dark: "#111111",
    light: "#FFF8E8"
  }
});

const svg = await QRCode.toString(url, {
  type: "svg",
  errorCorrectionLevel: "H",
  margin: 2,
  color: {
    dark: "#111111",
    light: "#FFF8E8"
  }
});

await fs.writeFile(path.join(outputDir, "saeed-portfolio-qr.svg"), svg, "utf8");
