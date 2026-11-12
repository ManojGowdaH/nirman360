import { steps } from "@/lib/content";
import { Container, SectionHeading } from "@/components/ui";

export function HowItWorks() {
  return (
    <section className="bg-white py-20 sm:py-28" aria-labelledby="how-title">
      <Container>
        <SectionHeading
          id="how-title"
          eyebrow="How it works"
          title="Construction Resources. Simplified."
          description="Four steps from finding a resource to continuing the conversation with the business that has it."
        />
        <ol className="mt-12 grid gap-4 md:grid-cols-4">
          {steps.map((step, index) => (
            <li key={step.title} className="rounded-3xl bg-paper p-6">
              <span className="font-display text-4xl text-orange/70" aria-hidden>
                0{index + 1}
              </span>
              <h3 className="mt-4 font-display text-2xl tracking-tight text-ink">{step.title}</h3>
              <p className="mt-3 text-sm leading-relaxed text-muted">{step.text}</p>
            </li>
          ))}
        </ol>
        <p className="mt-6 max-w-3xl text-sm leading-relaxed text-muted">
          This is the intended path. NIRMANH360 does not promise instant booking, guaranteed availability or automatic coordination. Price, timing and suitability are confirmed with the owner or supplier.
        </p>
      </Container>
    </section>
  );
}
