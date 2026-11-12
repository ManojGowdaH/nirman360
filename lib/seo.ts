import type { Metadata } from "next";
import { siteConfig } from "@/lib/config";

const image = {
  url: "/images/hero-site.jpg",
  width: 1200,
  height: 675,
  alt: "Construction site with a backhoe loader, excavator, dump truck, tower crane and a building frame",
};

export function createMetadata({
  title,
  description,
  path,
}: {
  title: string;
  description: string;
  path: string;
}): Metadata {
  const fullTitle = `${title} | ${siteConfig.name}`;
  return {
    title,
    description,
    alternates: { canonical: path },
    openGraph: {
      title: fullTitle,
      description,
      url: path,
      siteName: siteConfig.name,
      locale: "en_IN",
      type: "website",
      images: [image],
    },
    twitter: {
      card: "summary_large_image",
      title: fullTitle,
      description,
      images: [image.url],
    },
  };
}
