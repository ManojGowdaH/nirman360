import type { Metadata } from "next";
import { FAQAccordion } from "@/components/FAQAccordion";
import { PageHero } from "@/components/PageHero";
import { Button, Container } from "@/components/ui";
import { faqs } from "@/lib/content";
import { createMetadata } from "@/lib/seo";

export const metadata: Metadata = createMetadata({
  title: "FAQ",
  description: "Answers to common questions about NIRMANH360, construction resource categories, Bengaluru availability and support.",
  path: "/faq",
});

export default function FAQPage() {
  return (
    <>
      <PageHero
        eyebrow="Support"
        title="Frequently asked questions"
        description="What NIRMANH360 is, what it covers, and how to ask for help."
        path="/faq"
      />
      <section className="bg-paper py-16 sm:py-20">
        <Container className="max-w-3xl">
          <FAQAccordion items={faqs} />
          <div className="mt-8">
            <Button href="/contact" variant="dark">
              Contact support
            </Button>
          </div>
        </Container>
      </section>
    </>
  );
}
