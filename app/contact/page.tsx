import type { Metadata } from "next";
import { Suspense } from "react";
import { Mail, MapPin, Phone } from "lucide-react";
import { ContactForm } from "@/components/ContactForm";
import { PageHero } from "@/components/PageHero";
import { Container } from "@/components/ui";
import { siteConfig, socialLinks } from "@/lib/config";
import { createMetadata } from "@/lib/seo";

export const metadata: Metadata = createMetadata({
  title: "Contact",
  description: "Contact NIRMANH360 in Bengaluru about construction materials, equipment and partnership enquiries.",
  path: "/contact",
});

export default function ContactPage() {
  return (
    <>
      <PageHero
        eyebrow="Contact"
        title="Contact NIRMANH360"
        description="Ask about the platform, a resource category, or a partnership. Messages are recorded only when the enquiry inbox is connected."
        path="/contact"
      />
      <section className="bg-paper py-16 sm:py-20">
        <Container className="grid gap-10 lg:grid-cols-[0.85fr_1.15fr]">
          <div className="space-y-4">
            <article className="rounded-3xl bg-white p-6">
              <MapPin className="h-5 w-5 text-orange-deep" aria-hidden />
              <h2 className="mt-3 font-display text-2xl text-ink">Location</h2>
              <p className="mt-2 text-sm leading-relaxed text-muted">{siteConfig.location}</p>
              <p className="mt-2 text-sm text-muted">{siteConfig.businessAddress || "Street address not yet published."}</p>
            </article>
            <article className="rounded-3xl bg-white p-6">
              <Mail className="h-5 w-5 text-orange-deep" aria-hidden />
              <h2 className="mt-3 font-display text-2xl text-ink">Email</h2>
              {siteConfig.email ? (
                <a className="mt-2 inline-block text-sm font-medium text-orange-deep underline" href={`mailto:${siteConfig.email}`}>
                  {siteConfig.email}
                </a>
              ) : (
                <p className="mt-2 text-sm text-muted">Email address not yet published.</p>
              )}
            </article>
            <article className="rounded-3xl bg-white p-6">
              <Phone className="h-5 w-5 text-orange-deep" aria-hidden />
              <h2 className="mt-3 font-display text-2xl text-ink">Phone</h2>
              {siteConfig.phone ? (
                <a className="mt-2 inline-block text-sm font-medium text-orange-deep underline" href={`tel:${siteConfig.phone.replace(/\s/g, "")}`}>
                  {siteConfig.phone}
                </a>
              ) : (
                <p className="mt-2 text-sm text-muted">Phone number not yet published.</p>
              )}
            </article>
            <article className="rounded-3xl bg-ink p-6 text-white">
              <h2 className="font-display text-2xl">WhatsApp</h2>
              {siteConfig.whatsappUrl ? (
                <a className="mt-4 inline-flex min-h-11 items-center rounded-full bg-orange px-5 text-sm font-semibold text-ink" href={siteConfig.whatsappUrl} target="_blank" rel="noopener noreferrer">
                  Message on WhatsApp
                </a>
              ) : (
                <p className="mt-2 text-sm text-white/70">WhatsApp number not yet published.</p>
              )}
              <ul className="mt-5 space-y-2 text-sm">
                {socialLinks()
                  .filter((link) => link.label !== "WhatsApp")
                  .map((link) => (
                    <li key={link.label}>
                      {link.href ? (
                        <a href={link.href} className="text-white/80 underline" target="_blank" rel="noopener noreferrer">
                          {link.label}
                        </a>
                      ) : (
                        <span className="text-white/45">
                          {link.label}
                          <span className="sr-only">, link not published yet</span>
                        </span>
                      )}
                    </li>
                  ))}
              </ul>
            </article>
          </div>
          <Suspense fallback={<div className="h-96 rounded-3xl bg-white" />}>
            <ContactForm />
          </Suspense>
        </Container>
      </section>
    </>
  );
}
