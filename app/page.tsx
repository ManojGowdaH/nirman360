import Image from "next/image";
import Link from "next/link";
import { Compass, GitCompare, Users } from "lucide-react";
import { AppPromotion } from "@/components/AppPromotion";
import { CategoryCard } from "@/components/CategoryCard";
import { FAQAccordion } from "@/components/FAQAccordion";
import { FeatureCard } from "@/components/FeatureCard";
import { Hero } from "@/components/Hero";
import { HowItWorks } from "@/components/HowItWorks";
import { JsonLd } from "@/components/JsonLd";
import { PartnerCTA } from "@/components/PartnerCTA";
import { Reveal } from "@/components/Reveal";
import { Button, Container, SectionHeading } from "@/components/ui";
import { categories, faqs, features, industries } from "@/lib/content";

const highlights = [
  {
    icon: Compass,
    title: "Discover resources",
    text: "Look through the materials and equipment categories that match the work on your site.",
  },
  {
    icon: GitCompare,
    title: "Compare available options",
    text: "Review the details owners and suppliers choose to publish before you decide who to contact.",
  },
  {
    icon: Users,
    title: "Connect with owners",
    text: "Reach the business that has the resource, then continue the conversation with them.",
  },
];

export default function HomePage() {
  return (
    <>
      <JsonLd />
      <Hero />

      <section className="bg-paper py-20 sm:py-28" aria-labelledby="trust-title">
        <Container>
          <SectionHeading
            id="trust-title"
            eyebrow="The platform"
            title="A Smarter Way to Find Construction Resources"
            description="NIRMANH360 brings construction resource discovery into one digital platform, helping customers connect with material suppliers and equipment owners."
          />
          <div className="mt-12 grid gap-4 md:grid-cols-3">
            {highlights.map((item) => (
              <Reveal key={item.title}>
                <article className="h-full rounded-3xl bg-white p-6">
                  <item.icon className="h-6 w-6 text-orange-deep" aria-hidden />
                  <h3 className="mt-5 font-display text-2xl tracking-tight text-ink">{item.title}</h3>
                  <p className="mt-3 text-sm leading-relaxed text-muted">{item.text}</p>
                </article>
              </Reveal>
            ))}
          </div>
          <p className="mt-6 max-w-3xl text-sm leading-relaxed text-muted">
            What you can do in the mobile app depends on the features in the current release and on the listings that have been published. This website explains the platform. It does not show a live catalogue.
          </p>
        </Container>
      </section>

      <section id="categories" className="scroll-mt-24 bg-mist py-20 sm:py-28" aria-labelledby="categories-title">
        <Container>
          <SectionHeading
            id="categories-title"
            eyebrow="Categories"
            title="Everything You Need for Construction"
            description="Five resource groups, each with its own place in the marketplace. Explore opens the explanation for that category."
          />
          <div className="mt-12 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
            {categories.map((category) => (
              <CategoryCard key={category.id} category={category} />
            ))}
          </div>
        </Container>
      </section>

      <HowItWorks />

      <section className="bg-ink py-20 sm:py-28" aria-labelledby="why-title">
        <Container>
          <SectionHeading
            id="why-title"
            light
            eyebrow="Why NIRMANH360"
            title="Built Around Construction Needs"
            description="A focused marketplace for the resources a site actually looks for, without claims the product does not yet make."
          />
          <div className="mt-12 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {features.map((feature) => (
              <FeatureCard key={feature.title} {...feature} />
            ))}
          </div>
        </Container>
      </section>

      <section className="bg-paper py-20 sm:py-28" aria-labelledby="audience-title">
        <Container>
          <SectionHeading id="audience-title" eyebrow="Who it is for" title="Who Can Use NIRMANH360?" />
          <div className="mt-12 grid gap-5 lg:grid-cols-2">
            <article className="flex flex-col rounded-3xl bg-white p-8 sm:p-10">
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-orange-deep">For customers</p>
              <h3 className="mt-3 font-display text-3xl tracking-tight text-ink">Find what the site needs</h3>
              <p className="mt-4 flex-1 text-base leading-relaxed text-muted">
                Looking for construction materials or equipment? Discover available resources and connect with owners for your project requirements.
              </p>
              <div className="mt-8">
                <Button href="/services" variant="dark">
                  Explore the Platform
                </Button>
              </div>
            </article>
            <article className="flex flex-col rounded-3xl bg-ink p-8 text-white sm:p-10">
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-ember">For owners and suppliers</p>
              <h3 className="mt-3 font-display text-3xl tracking-tight">Put your resources in front of customers</h3>
              <p className="mt-4 flex-1 text-base leading-relaxed text-white/75">
                Own construction equipment or supply construction materials? Explore the opportunity to connect with potential customers through NIRMANH360.
              </p>
              <div className="mt-8">
                <Button href="/partners">Become a Partner</Button>
              </div>
            </article>
          </div>
        </Container>
      </section>

      <section className="bg-white py-20 sm:py-28" aria-labelledby="industries-title">
        <Container>
          <SectionHeading
            id="industries-title"
            eyebrow="Applications"
            title="Industries and Applications"
            description="The kinds of work the platform is being built to serve, starting with projects around Bengaluru."
          />
          <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {industries.map((industry) => (
              <article key={industry.title} className="overflow-hidden rounded-3xl bg-paper">
                <div className="relative aspect-[4/3]">
                  <Image src={industry.image} alt={industry.imageAlt} fill sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw" className="object-cover" />
                </div>
                <div className="p-6">
                  <h3 className="font-display text-2xl tracking-tight text-ink">{industry.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-muted">{industry.text}</p>
                </div>
              </article>
            ))}
          </div>
        </Container>
      </section>

      <AppPromotion />
      <PartnerCTA />

      <section id="faq" className="scroll-mt-24 bg-paper py-20 sm:py-28" aria-labelledby="faq-title">
        <Container className="grid gap-10 lg:grid-cols-[0.8fr_1.2fr]">
          <SectionHeading
            id="faq-title"
            eyebrow="Questions"
            title="Frequently asked questions"
            description="Straight answers about what the platform is for, and what this website does not claim."
          />
          <div>
            <FAQAccordion items={faqs.slice(0, 8)} />
            <p className="mt-5 text-sm">
              <Link href="/faq" className="font-semibold text-orange-deep underline">
                Read all questions
              </Link>
            </p>
          </div>
        </Container>
      </section>

      <section className="bg-[#202428] py-20 text-white sm:py-24" aria-labelledby="final-title">
        <Container className="max-w-3xl text-center">
          <h2 id="final-title" className="font-display text-4xl tracking-tight sm:text-6xl">
            Let&apos;s Build Something Better.
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-base leading-relaxed text-white/75">
            Discover a smarter way to connect with construction resources.
          </p>
          <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
            <Button href="/services">Explore NIRMANH360</Button>
            <Button href="/contact" variant="secondary">
              Contact Us
            </Button>
          </div>
        </Container>
      </section>
    </>
  );
}
