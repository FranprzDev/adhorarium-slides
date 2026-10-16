// Generates the closing slide QR code as a static SVG so the deck works offline.
import { writeFile } from "node:fs/promises";
import QRCode from "qrcode";

const PROD_URL = "https://adhorarium.vercel.app";

const svg = await QRCode.toString(PROD_URL, {
  type: "svg",
  errorCorrectionLevel: "M",
  margin: 1,
  color: { dark: "#13294B", light: "#FFFFFF" },
});

await writeFile(new URL("../public/qr-adhorarium.svg", import.meta.url), svg);
console.log(`QR for ${PROD_URL} written to public/qr-adhorarium.svg`);
