import fs from "fs";
import path from "path";

export function getAppScreenshots() {
  const dir = path.join(process.cwd(), "public", "screenshots");
  if (!fs.existsSync(dir)) return [];
  return fs
    .readdirSync(dir)
    .filter((file) => /\.(png|jpe?g|webp|avif)$/i.test(file))
    .sort()
    .map((file) => `/screenshots/${file}`);
}
