import type { Metadata } from "next";
import { PageHero } from "@/components/PageHero";
import { PartnerForm } from "@/components/PartnerForm";
import { Container } from "@/components/ui";
import { createMetadata } from "@/lib/seo";

export const metadata: Metadata = createMetadata({
  title: "Become a Partner",
  description: "Equipment owners and material suppliers can enquire about joining NIRMANH360 and connecting with construction customers.",
  path: "/partners",
});

const equipment = ["JCB owners", "Excavator owners", "Tractor owners", "Crane owners", "Dumper owners", "Heavy equipment owners"];
const materials = ["Cement suppliers", "Sand suppliers", "Steel suppliers", "Brick suppliers", "Aggregate suppliers"];

export default function PartnersPage() {
  return (
    <>
      <PageHero
        eyebrow="Partners"
        title="Your Resources. More Opportunities."
        description="Join the NIRMANH360 ecosystem and connect your construction resource business with potential customers."
        path="/partners"
      />
      <section className="bg-paper py-16 sm:py-20">
        <Container className="grid gap-5 md:grid-cols-2">
          <article className="rounded-3xl bg-white p-8">
            <h2 className="font-display text-3xl tracking-tight text-ink">Equipment owner</h2>
            <p className="mt-3 text-sm leading-relaxed text-muted">
              If you own machines that sites hire, you can enquire about reaching customers who are looking for that equipment.
            </p>
            <ul className="mt-5 space-y-2 text-sm text-ink">
              {equipment.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </article>
          <article className="rounded-3xl bg-ink p-8 text-white">
            <h2 className="font-display text-3xl tracking-tight">Material supplier</h2>
            <p className="mt-3 text-sm leading-relaxed text-white/75">
              If you supply construction materials, you can enquire about being found by customers who need those materials.
            </p>
            <ul className="mt-5 space-y-2 text-sm">
              {materials.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </article>
        </Container>
      </section>
      <section className="bg-mist py-16 sm:py-20" aria-labelledby="partner-form-title">
        <Container className="max-w-3xl">
          <h2 id="partner-form-title" className="font-display text-3xl tracking-tight text-ink">
            Partner enquiry
          </h2>
          <p className="mt-3 text-sm leading-relaxed text-muted">
            The form asks for contact and resource details only. It does not collect bank details, UPI PINs, passwords or identity documents. An enquiry is not a published listing.
          </p>
          <div className="mt-8">
            <PartnerForm />
          </div>
        </Container>
      </section>
    </>
  );
}
