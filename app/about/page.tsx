import type { Metadata } from "next";
import Image from "next/image";
import { PageHero } from "@/components/PageHero";
import { Container } from "@/components/ui";
import { audiences } from "@/lib/content";
import { siteConfig } from "@/lib/config";
import { createMetadata } from "@/lib/seo";

export const metadata: Metadata = createMetadata({
  title: "About",
  description: "NIRMANH360 is a construction technology platform in Bengaluru that helps customers, suppliers and equipment owners find each other.",
  path: "/about",
});

export default function AboutPage() {
  return (
    <>
      <PageHero
        eyebrow="About"
        title="About NIRMANH360"
        description="A construction technology platform designed to bring customers, material suppliers and equipment owners into the same marketplace."
        path="/about"
      />
      <section className="bg-paper py-16 sm:py-20">
        <Container className="grid items-start gap-10 lg:grid-cols-[1.1fr_0.9fr]">
          <div className="space-y-5 text-base leading-relaxed text-muted">
            <p className="text-lg text-ink">
              NIRMANH360 is a construction technology platform designed to bring customers, construction material suppliers and equipment owners closer through a digital marketplace experience.
            </p>
            <p>
              The business is based in {siteConfig.location}. The first focus is Bengaluru and the surrounding area. This site does not describe the platform as a nationwide service.
            </p>
            <h2 className="pt-4 font-display text-3xl tracking-tight text-ink">The problem</h2>
            <p>
              Materials and machines are often found through personal networks, repeated phone calls and incomplete information. That makes comparison slower than it needs to be, and it makes it harder for a capable owner or supplier to be found.
            </p>
            <h2 className="pt-4 font-display text-3xl tracking-tight text-ink">Vision</h2>
            <p>Construction teams should be able to find the resources a site needs without starting from a blank contact list.</p>
            <h2 className="pt-4 font-display text-3xl tracking-tight text-ink">Mission</h2>
            <p>To simplify how customers, suppliers and equipment owners find each other for construction work, starting in Bengaluru.</p>
          </div>
          <div className="relative aspect-[4/5] overflow-hidden rounded-3xl">
            <Image
              src="/images/ind-commercial.jpg"
              alt="A commercial building under construction at dusk"
              fill
              sizes="(min-width: 1024px) 40vw, 100vw"
              className="object-cover"
            />
          </div>
        </Container>
      </section>
      <section className="bg-white py-16 sm:py-20">
        <Container className="grid gap-8 md:grid-cols-2">
          <article>
            <h2 className="font-display text-3xl tracking-tight text-ink">Our approach</h2>
            <p className="mt-4 text-base leading-relaxed text-muted">
              Make discovery, comparison and contact clearer. Availability, price and suitability stay with the owner or supplier. NIRMANH360 does not replace engineering judgement, statutory approvals or a direct agreement between the parties.
            </p>
          </article>
          <article>
            <h2 className="font-display text-3xl tracking-tight text-ink">Our commitment</h2>
            <p className="mt-4 text-base leading-relaxed text-muted">
              To keep the product understandable: say what the marketplace is for, and avoid claims about verification, insurance, guaranteed delivery or guaranteed prices unless those services are actually offered.
            </p>
          </article>
        </Container>
      </section>
      <section className="bg-paper py-16 sm:py-20">
        <Container>
          <h2 className="font-display text-3xl tracking-tight text-ink">Who the platform serves</h2>
          <ul className="mt-6 grid gap-3 sm:grid-cols-2">
            {audiences.map((item) => (
              <li key={item} className="rounded-2xl bg-white px-4 py-3 text-sm font-medium text-ink">
                {item}
              </li>
            ))}
          </ul>
          <div className="mt-10 rounded-3xl border border-dashed border-black/15 bg-white p-6 text-sm leading-relaxed text-muted">
            <p className="font-medium text-ink">Business details still to be published</p>
            <p className="mt-2">Legal name: {siteConfig.legalName || "Not yet published."}</p>
            <p>Registered address: {siteConfig.businessAddress || "Not yet published."}</p>
            <p className="mt-2">Founding date, registration number, awards and team biographies are not shown because they have not been supplied.</p>
          </div>
        </Container>
      </section>
    </>
  );
}
