import type { Metadata } from "next";
import Link from "next/link";
import { AccountDeletionForm } from "@/components/AccountDeletionForm";
import { PageHero } from "@/components/PageHero";
import { Container } from "@/components/ui";
import { siteConfig } from "@/lib/config";
import { createMetadata } from "@/lib/seo";

export const metadata: Metadata = createMetadata({
  title: "Request Account Deletion",
  description: "Request deletion of a NIRMANH360 account and associated personal information.",
  path: "/delete-account",
});

const steps = siteConfig.inAppAccountDeletion
  ? [
      "Open the NIRMANH360 mobile application.",
      "Sign in to your account.",
      "Navigate to the account or profile settings.",
      "Select the account deletion option.",
      "Follow the confirmation process in the app.",
    ]
  : [
      "Open the NIRMANH360 mobile application.",
      "Sign in to your account.",
      "Navigate to the account or profile settings.",
      "An in-app deletion control is not marked as available yet. Until it is released, use the form on this page.",
      "You do not need an account on this website to send the request.",
    ];

export default function DeleteAccountPage() {
  return (
    <>
      <PageHero
        eyebrow="Privacy"
        title="Request Account Deletion"
        description="If you no longer wish to use NIRMANH360, you can request deletion of your account and associated personal information."
        path="/delete-account"
      />
      <section className="bg-paper py-16 sm:py-20">
        <Container className="grid gap-10 lg:grid-cols-[0.9fr_1.1fr]">
          <div className="space-y-8 text-sm leading-relaxed text-muted">
            <div>
              <h2 className="font-display text-3xl tracking-tight text-ink">How to delete your account</h2>
              <ol className="mt-4 list-decimal space-y-2 pl-5">
                {steps.map((step) => (
                  <li key={step}>{step}</li>
                ))}
              </ol>
              {siteConfig.inAppAccountDeletion ? null : (
                <p className="mt-4 rounded-2xl bg-amber-50 px-4 py-3 text-amber-950">
                  The mobile app still needs its own account deletion control before that path can be offered to users. This public page is available without signing in.
                </p>
              )}
            </div>
            <div>
              <h2 className="font-display text-3xl tracking-tight text-ink">What happens to a request</h2>
              <ul className="mt-4 list-disc space-y-2 pl-5">
                <li>Account access may be disabled during processing where that is appropriate.</li>
                <li>Personal information will be deleted or anonymised when it can be.</li>
                <li>Certain transaction, financial, security or legal records may be retained where the law requires it.</li>
                <li>You may be contacted to verify that you own the account.</li>
                <li>Deletion is subject to applicable legal requirements. The form does not complete deletion by itself.</li>
              </ul>
            </div>
            <p>
              Support contact: {siteConfig.privacyEmail || siteConfig.email || "Not yet published."} Read the{" "}
              <Link href="/privacy-policy" className="font-medium text-orange-deep underline">
                Privacy Policy
              </Link>{" "}
              for how information is handled.
            </p>
          </div>
          <AccountDeletionForm />
        </Container>
      </section>
    </>
  );
}
