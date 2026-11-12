import type { MetadataRoute } from "next";
import { legalDates, siteConfig } from "@/lib/config";

const paths = [
  "/",
  "/about",
  "/services",
  "/partners",
  "/contact",
  "/faq",
  "/privacy-policy",
  "/delete-account",
  "/terms-and-conditions",
];

export default function sitemap(): MetadataRoute.Sitemap {
  return paths.map((path) => ({
    url: path === "/" ? `${siteConfig.url}/` : `${siteConfig.url}${path}`,
    lastModified: legalDates.iso,
    changeFrequency: path === "/" ? "weekly" : "monthly",
    priority: path === "/" ? 1 : 0.7,
  }));
}
