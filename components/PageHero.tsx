import Link from "next/link";
import { siteConfig } from "@/lib/config";
import { Container } from "@/components/ui";

export function PageHero({
  eyebrow,
  title,
  description,
  path,
}: {
  eyebrow: string;
  title: string;
  description: string;
  path: string;
}) {
  const crumbs = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: `${siteConfig.url}/` },
      { "@type": "ListItem", position: 2, name: title, item: `${siteConfig.url}${path}` },
    ],
  };

  return (
    <section className="bg-ink pt-28 pb-14 text-white sm:pt-32 sm:pb-16">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(crumbs) }} />
      <Container>
        <nav aria-label="Breadcrumb" className="text-sm text-white/60">
          <Link href="/" className="hover:text-white">
            Home
          </Link>
          <span aria-hidden="true"> / </span>
          <span className="text-white">{title}</span>
        </nav>
        <p className="mt-6 text-xs font-semibold uppercase tracking-[0.18em] text-ember">{eyebrow}</p>
        <h1 className="mt-3 max-w-3xl font-display text-4xl tracking-tight sm:text-6xl">{title}</h1>
        <p className="mt-5 max-w-2xl text-base leading-relaxed text-white/75 sm:text-lg">{description}</p>
      </Container>
    </section>
  );
}
