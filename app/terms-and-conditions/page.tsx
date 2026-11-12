import type { Metadata } from "next";
import Link from "next/link";
import { PageHero } from "@/components/PageHero";
import { Container } from "@/components/ui";
import { legalDates, siteConfig } from "@/lib/config";
import { createMetadata } from "@/lib/seo";

export const metadata: Metadata = createMetadata({
  title: "Terms and Conditions",
  description: "Terms for using the NIRMANH360 website and construction resource marketplace.",
  path: "/terms-and-conditions",
});

export default function TermsPage() {
  return (
    <>
      <PageHero
        eyebrow="Legal"
        title="Terms and Conditions"
        description="These terms explain how the NIRMANH360 website and marketplace are meant to be used. They need a final legal review before they are relied on."
        path="/terms-and-conditions"
      />
      <article className="bg-paper py-16 sm:py-20">
        <Container className="legal-copy max-w-3xl">
          <p>
            Effective date: {legalDates.effective}
            <br />
            Last updated: {legalDates.updated}
          </p>
          <p>
            These terms are a working draft for the NIRMANH360 website and, where the same rules apply, the mobile application. They do not invent refund rules, service guarantees or a company registration that has not been supplied. They should be reviewed by counsel before publication is treated as final.
          </p>

          <h2>1. Introduction</h2>
          <p>
            NIRMANH360 operates a digital marketplace that helps customers discover construction materials and equipment and connect with owners and suppliers. The business location stated for this website is {siteConfig.location}. The legal name
            {siteConfig.legalName ? ` is ${siteConfig.legalName}.` : " has not yet been published."} The registered address
            {siteConfig.businessAddress ? ` is ${siteConfig.businessAddress}.` : " has not yet been published."}
          </p>

          <h2>2. Acceptance of Terms</h2>
          <p>
            By using the website, you agree to these terms. If you do not agree, do not use the website. Use of the mobile application may also be subject to the terms presented in the app. If those in-app terms differ on a point that concerns the app, the in-app terms apply to the app.
          </p>

          <h2>3. Platform Description</h2>
          <p>
            The platform is a place for customers, equipment owners and material suppliers to find one another. Unless a later written agreement says otherwise, NIRMANH360 is not a party to a contract for the sale, hire or supply of materials or equipment. A listing or an enquiry is not, by itself, an offer that NIRMANH360 has accepted, and it is not a confirmed booking.
          </p>

          <h2>4. Customer Responsibilities</h2>
          <p>If you use the platform as a customer, you are responsible for:</p>
          <ul>
            <li>The accuracy of the information you submit.</li>
            <li>Checking that a resource, price, timing and condition meet your project before you rely on them.</li>
            <li>Complying with law that applies to your project, including permissions and safety duties.</li>
            <li>Your own agreement with the owner or supplier.</li>
          </ul>

          <h2>5. Owner and Supplier Responsibilities</h2>
          <p>If you offer resources through the platform, you are responsible for:</p>
          <ul>
            <li>Having the right to offer the equipment or materials you describe.</li>
            <li>The accuracy of your listing, including condition, quantity and any restriction on use.</li>
            <li>Complying with law that applies to your business, your equipment and the materials you supply.</li>
            <li>Dealing fairly with customers you choose to transact with.</li>
          </ul>

          <h2>6. Listings and Information Accuracy</h2>
          <p>
            Listings are provided by owners and suppliers. NIRMANH360 does not claim that every listing has been inspected, verified or insured. You should make your own checks. We may refuse or remove a listing or enquiry that appears misleading, unlawful or outside the purpose of the platform.
          </p>

          <h2>7. Bookings and Transactions</h2>
          <p>
            Where the app lets users discuss a booking, the commercial terms are between the customer and the owner or supplier unless a written agreement later says that NIRMANH360 is contracting in its own name. Availability is not guaranteed. This website does not show live inventory and does not complete a booking.
          </p>

          <h2>8. Payments</h2>
          <p>
            This website does not collect payments. If the app offers payment, the payment is processed by the payment provider enabled for that release. NIRMANH360 does not ask you to submit a UPI PIN, bank password or full card number to this website. Any fee charged by the platform will be shown before you incur it, in the surface that actually charges it.
          </p>

          <h2>9. Cancellations and Refunds</h2>
          <p>
            This website does not publish a refund promise. Cancellation and refund terms, where a transaction exists, are those agreed between the customer and the owner or supplier, or those stated in a later policy that matches the payment feature actually in use. Nothing on this page creates a right to a refund that has not been agreed.
          </p>

          <h2>10. Prohibited Activities</h2>
          <p>You must not:</p>
          <ul>
            <li>Break the law, or offer unlawful, stolen or unsafe goods or equipment.</li>
            <li>Misrepresent who you are, what you own, or the condition of a resource.</li>
            <li>Attempt to access accounts, data or systems without authorisation.</li>
            <li>Interfere with the website, or upload malware.</li>
            <li>Scrape the service in a way that degrades it for others.</li>
            <li>Use the forms to send unsolicited commercial messages unrelated to a genuine enquiry.</li>
          </ul>

          <h2>11. Intellectual Property</h2>
          <p>
            The NIRMANH360 name, logo and the design of this website belong to the business operating the platform, or are used with permission. You keep ownership of content you submit. You give the platform a licence to host and display that content for the purpose of operating the marketplace, for as long as the content remains on the service.
          </p>

          <h2>12. Platform Availability</h2>
          <p>
            The website and app are provided as available. Features can change, and a feature described as planned may not be in the version you are using. We do not promise uninterrupted access.
          </p>

          <h2>13. Limitation of Liability</h2>
          <p>
            To the extent permitted by Indian law, NIRMANH360 is not liable for indirect or consequential loss arising from the use of the website, or from a transaction between a customer and an owner or supplier. Nothing in these terms excludes liability that cannot legally be excluded, including liability for fraud or for a right that a statute does not allow a contract to waive.
          </p>

          <h2>14. Suspension and Termination</h2>
          <p>
            We may suspend or stop access to the website or app where we reasonably believe these terms have been breached, where we need to protect users or the service, or where the law requires it. You may stop using the website at any time. Account deletion is described on the <Link href="/delete-account">account deletion page</Link>.
          </p>

          <h2>15. Changes to Terms</h2>
          <p>
            We may update these terms by posting a new version on this page and changing the “Last updated” date. If a change is material and the law requires notice, we will provide that notice through a channel we actually operate. Continuing to use the website after the update means you accept the updated terms, where the law allows that.
          </p>

          <h2>16. Governing Law and Jurisdiction</h2>
          <p>
            These terms are intended to be governed by the laws of India. The proposed venue for disputes is the courts at Bengaluru, Karnataka, subject to legal review and to any mandatory right you have to bring a claim elsewhere. This paragraph is a proposal for review, not a final jurisdiction clause.
          </p>

          <h2>17. Contact Information</h2>
          <p>Email: {siteConfig.email || "Not yet published."}</p>
          <p>Phone: {siteConfig.phone || "Not yet published."}</p>
          <p>Legal name: {siteConfig.legalName || "Not yet published."}</p>
          <p>Address: {siteConfig.businessAddress || "Not yet published."}</p>
          <p>
            You can also use the <Link href="/contact">contact form</Link>. See the <Link href="/privacy-policy">Privacy Policy</Link> for how personal information is handled.
          </p>
        </Container>
      </article>
    </>
  );
}
