import type { MetadataRoute } from "next";
import { siteConfig } from "@/lib/config";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: siteConfig.name,
    short_name: siteConfig.name,
    description: siteConfig.description,
    start_url: "/",
    display: "browser",
    background_color: "#F5F3EF",
    theme_color: "#15191D",
    icons: [
      {
        src: "/brand/app-icon.png",
        type: "image/png",
        sizes: "1024x1024",
        purpose: "any",
      },
    ],
  };
}
