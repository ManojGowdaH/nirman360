import { siteConfig } from "@/lib/config";

export function JsonLd() {
  const sameAs = [siteConfig.social.instagram, siteConfig.social.linkedin, siteConfig.social.facebook].filter(Boolean);
  const organization: Record<string, unknown> = {
    "@type": "Organization",
    name: siteConfig.name,
    url: siteConfig.url,
    logo: `${siteConfig.url}/brand/app-icon.png`,
    description: siteConfig.description,
    areaServed: {
      "@type": "City",
      name: "Bengaluru",
      address: {
        "@type": "PostalAddress",
        addressLocality: "Bengaluru",
        addressRegion: "Karnataka",
        addressCountry: "IN",
      },
    },
  };
  if (siteConfig.email) organization.email = siteConfig.email;
  if (siteConfig.phone) organization.telephone = siteConfig.phone;
  if (sameAs.length) organization.sameAs = sameAs;
  if (siteConfig.legalName) organization.legalName = siteConfig.legalName;

  const graph = {
    "@context": "https://schema.org",
    "@graph": [
      organization,
      {
        "@type": "WebSite",
        name: siteConfig.name,
        url: siteConfig.url,
        description: siteConfig.description,
        inLanguage: "en-IN",
        publisher: { "@type": "Organization", name: siteConfig.name },
      },
    ],
  };

  return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(graph) }} />;
}
