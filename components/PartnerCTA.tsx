import { Button, Container } from "@/components/ui";

export function PartnerCTA() {
  return (
    <section className="bg-ink" aria-labelledby="partner-cta-title">
      <Container className="grid items-center gap-8 py-16 md:grid-cols-[1.3fr_0.7fr] md:py-20">
        <div>
          <h2 id="partner-cta-title" className="font-display text-3xl tracking-tight text-white sm:text-5xl">
            Own Construction Resources? Grow With NIRMANH360.
          </h2>
          <p className="mt-4 max-w-xl text-base leading-relaxed text-white/75 sm:text-lg">
            Connect your equipment or material business with customers looking for construction resources.
          </p>
          <div className="mt-8">
            <Button href="/partners">Become a Partner</Button>
          </div>
        </div>
        <div className="rounded-3xl bg-orange px-6 py-10 text-ink sm:px-8">
          <p className="font-display text-2xl tracking-tight">Equipment owners and material suppliers.</p>
          <p className="mt-3 text-sm leading-relaxed">
            Tell us what you have available. An enquiry is a conversation, not an automatic listing.
          </p>
        </div>
      </Container>
    </section>
  );
}
