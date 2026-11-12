import type { Metadata } from "next";
import Image from "next/image";
import { PageHero } from "@/components/PageHero";
import { PartnerCTA } from "@/components/PartnerCTA";
import { Button, Container } from "@/components/ui";
import { categories } from "@/lib/content";
import { createMetadata } from "@/lib/seo";

export const metadata: Metadata = createMetadata({
  title: "Services",
  description: "Explore NIRMANH360 resource categories: commercial vehicles, materials, heavy equipment, power tools, and scaffolding and safety equipment.",
  path: "/services",
});

export default function ServicesPage() {
  return (
    <>
      <PageHero
        eyebrow="Services"
        title="Services and categories"
        description="Five ways the marketplace organises construction resources. These pages explain each category. They are not a live stock list."
        path="/services"
      />
      <div className="bg-paper">
        {categories.map((category, index) => (
          <section key={category.id} id={category.id} className="scroll-mt-24 border-b border-black/5 py-16 sm:py-20" aria-labelledby={`${category.id}-title`}>
            <Container className="grid items-center gap-8 lg:grid-cols-2">
              <div className={`relative aspect-[4/3] overflow-hidden rounded-3xl ${index % 2 === 1 ? "lg:order-2" : ""}`}>
                <Image src={category.image} alt={category.imageAlt} fill sizes="(min-width: 1024px) 50vw, 100vw" className="object-cover" />
              </div>
              <div>
                <h2 id={`${category.id}-title`} className="font-display text-3xl tracking-tight text-ink sm:text-4xl">
                  {category.title}
                </h2>
                <p className="mt-4 text-base leading-relaxed text-muted">{category.explanation}</p>
                <ul className="mt-5 flex flex-wrap gap-2">
                  {category.examples.map((item) => (
                    <li key={item} className="rounded-full bg-white px-3 py-1 text-sm text-ink">
                      {item}
                    </li>
                  ))}
                </ul>
                <p className="mt-5 text-sm leading-relaxed text-muted">
                  <span className="font-semibold text-ink">Intended use. </span>
                  {category.use}
                </p>
                <div className="mt-6 flex flex-col gap-3 sm:flex-row">
                  <Button href={`/contact?subject=${encodeURIComponent(category.title)}`} variant="dark">
                    Ask about this category
                  </Button>
                  <Button href="/partners" variant="light">
                    List resources
                  </Button>
                </div>
              </div>
            </Container>
          </section>
        ))}
      </div>
      <PartnerCTA />
    </>
  );
}
