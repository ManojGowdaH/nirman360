import type { Metadata } from "next";
import Link from "next/link";
import { PageHero } from "@/components/PageHero";
import { Container } from "@/components/ui";
import { legalDates, siteConfig } from "@/lib/config";
import { createMetadata } from "@/lib/seo";

export const metadata: Metadata = createMetadata({
  title: "Privacy Policy",
  description: "How NIRMANH360 handles personal information on its website and mobile application.",
  path: "/privacy-policy",
});

const contents = [
  ["introduction", "Introduction"],
  ["information-we-collect", "Information We Collect"],
  ["personal-information", "Personal Information"],
  ["account", "Account and Authentication Information"],
  ["location", "Location Information"],
  ["permissions", "Device Permissions"],
  ["listings", "Construction Listing Information"],
  ["transactions", "Booking and Transaction Information"],
  ["use", "How We Use Information"],
  ["sharing", "How We Share Information"],
  ["providers", "Third-Party Service Providers"],
  ["payments", "Payment Processing"],
  ["security", "Data Security"],
  ["retention", "Data Retention"],
  ["deletion", "Account Deletion"],
  ["rights", "User Rights and Choices"],
  ["cookies", "Cookies and Website Technologies"],
  ["children", "Children's Privacy"],
  ["changes", "Changes to This Policy"],
  ["contact", "Contact Information"],
];

export default function PrivacyPage() {
  return (
    <>
      <PageHero
        eyebrow="Legal"
        title="Privacy Policy"
        description="This policy describes how the NIRMANH360 website and mobile application handle personal information, limited to the practices the product actually supports."
        path="/privacy-policy"
      />
      <article className="bg-paper py-16 sm:py-20">
        <Container className="legal-copy max-w-3xl">
          <p>
            Effective date: {legalDates.effective}
            <br />
            Last updated: {legalDates.updated}
          </p>
          <p>
            This policy applies to the NIRMANH360 website at {siteConfig.url} and to the NIRMANH360 mobile application, subject to the features that are actually available in the version you use. It is written so it can be reviewed against the Digital Personal Data Protection Act, 2023 and applicable rules. It is not a certificate of compliance, and the unpublished business details below must be completed before the policy is treated as final.
          </p>
          <nav aria-label="On this page">
            <ol className="grid gap-2 sm:grid-cols-2">
              {contents.map(([id, label], index) => (
                <li key={id}>
                  <a href={`#${id}`}>
                    {index + 1}. {label}
                  </a>
                </li>
              ))}
            </ol>
          </nav>

          <h2 id="introduction">1. Introduction</h2>
          <p>
            NIRMANH360 is a construction resource marketplace being built for customers, equipment owners and material suppliers, starting in Bengaluru, Karnataka, India. In this policy, “we” means the business operating NIRMANH360. The legal name
            {siteConfig.legalName ? ` is ${siteConfig.legalName}.` : " has not yet been published on this page."}
          </p>

          <h2 id="information-we-collect">2. Information We Collect</h2>
          <p>Depending on the features you use, the website or the app may process:</p>
          <ul>
            <li>Name, mobile number and email address.</li>
            <li>Account and authentication information.</li>
            <li>Location data, when you grant permission in the app.</li>
            <li>Construction material or equipment listing details, including photos you upload.</li>
            <li>Booking information, order amount, payment status and a transaction reference, when those features are available.</li>
            <li>Messages you send to support, and partner or deletion requests submitted on this website.</li>
            <li>Basic technical and diagnostic information needed to operate and protect the service.</li>
          </ul>
          <p>This marketing website does not ask for bank details, UPI PINs, passwords or identity documents.</p>

          <h2 id="personal-information">3. Personal Information</h2>
          <p>
            If you use a form on this website, you may provide your name, mobile number, email address, city, area, business name and a short description of your request. Partner and contact forms are sent only when a server-side inbox is configured. If it is not configured, the form tells you and does not store the submission.
          </p>

          <h2 id="account">4. Account and Authentication Information</h2>
          <p>
            If you create an account in the mobile application, the app processes the identifiers it asks for, such as a name, mobile number, email address and the authentication tokens needed to keep you signed in. The website forms do not create an app account. The exact sign-in method is the one implemented in the current app release.
          </p>

          <h2 id="location">5. Location Information</h2>
          <p>
            Location may be used in the app to help you discover resources that are relevant to the area where you are working. That happens only if you grant location permission. You can change or withdraw that permission in your device settings. This website does not request your device location.
          </p>

          <h2 id="permissions">6. Device Permissions</h2>
          <p>
            The website does not request camera, photo, microphone or location permission. The mobile app may request location permission, and permission to use photos when you add them to a listing. Any other permission is requested in the app at the time a feature needs it, and can be managed in your device settings.
          </p>

          <h2 id="listings">7. Construction Listing Information</h2>
          <p>
            If the app lets you create or manage a material or equipment listing, we process the details you enter, such as the resource type, description and the area you serve. Photos you upload are stored so the listing can be shown to other users of the marketplace.
          </p>

          <h2 id="transactions">8. Booking and Transaction Information</h2>
          <p>
            If a version of the app supports bookings or payments, we may process booking details, the order amount, the payment status and a transaction reference supplied by the payment provider. This website does not take payments and does not display live orders.
          </p>

          <h2 id="use">9. How We Use Information</h2>
          <p>Information is used to:</p>
          <ul>
            <li>Provide the marketplace and respond to enquiries.</li>
            <li>Help users discover resources and contact the relevant owner or supplier.</li>
            <li>Record and process account deletion requests.</li>
            <li>Protect the service, limit abuse and fix faults.</li>
            <li>Meet legal, accounting and dispute-resolution duties.</li>
          </ul>
          <p>The consent on a website form covers a reply to that enquiry. It is not consent for a separate marketing list.</p>

          <h2 id="sharing">10. How We Share Information</h2>
          <p>Personal information is shared only when it is needed to operate the service, with:</p>
          <ul>
            <li>The relevant customer, owner or supplier, so a marketplace enquiry or listing can function.</li>
            <li>Payment processors, when a payment feature is available.</li>
            <li>Hosting and infrastructure providers that serve the website or app.</li>
            <li>Technical service providers who process data on our instructions.</li>
            <li>Legal authorities when the law requires it.</li>
          </ul>
          <p>Personal information is not sold to third parties.</p>

          <h2 id="providers">11. Third-Party Service Providers</h2>
          <p>
            This website is built to be hosted on Vercel. If it is deployed there, Vercel processes the technical data needed to deliver the site. Enquiry storage, when enabled by the operator, uses either Supabase or a private webhook configured on the server. The mobile application has its own backend. A public list of processors should be updated when vendors change. Providers are expected to process information only for the service they are engaged to perform.
          </p>

          <h2 id="payments">12. Payment Processing</h2>
          <p>
            When payment functionality is available, a third-party payment service provider may process the payment. NIRMANH360 does not ask for or store UPI PINs, bank passwords or complete card details on this website. Where a payment feature exists, sensitive payment credentials are handled by the relevant payment provider. This policy does not name a production payment provider, because a production payment integration has not been verified for this website.
          </p>

          <h2 id="security">13. Data Security</h2>
          <p>
            We use reasonable technical and organisational safeguards. For this website those include HTTPS on the public site, access control for server credentials, server-side validation of form input, and storage of a hash of the network address with a form request rather than the raw address. No method of transmission or storage is completely secure, and this policy does not promise absolute security.
          </p>

          <h2 id="retention">14. Data Retention</h2>
          <p>
            Information is kept only for as long as it is needed to provide the service, keep required records, resolve disputes and meet legal obligations. When it is no longer needed, it is deleted or anonymised, unless a law requires a longer period.
          </p>

          <h2 id="deletion">15. Account Deletion</h2>
          <p>
            You can request deletion of your account and associated personal information at{" "}
            <Link href="/delete-account">https://nirman360.in/delete-account</Link>. The public page does not require you to sign in. Submitting the form records a request when the inbox is connected. It does not, by itself, delete the account. We may contact you to verify that you control the account. Some transaction, financial, security or legal records may be retained where the law requires it. The mobile app should also provide a way to start deletion from inside the account once that control is released.
          </p>

          <h2 id="rights">16. User Rights and Choices</h2>
          <p>
            Subject to applicable law, you may request access to, correction of, or deletion of personal information, and you may withdraw consent you have given. You can also raise a grievance about how your information is handled. A dedicated grievance contact will be published in the contact section once it is confirmed. Until then, use the contact method that is actually published on this page, or the deletion page for a deletion request.
          </p>

          <h2 id="cookies">17. Cookies and Website Technologies</h2>
          <p>
            As shipped, this website does not set advertising or analytics cookies. If the host or a security control sets a strictly necessary cookie, it is used only to deliver or protect the site. The website does not use those technologies to sell personal information.
          </p>

          <h2 id="children">18. Children&apos;s Privacy</h2>
          <p>
            NIRMANH360 is meant for people arranging construction resources. It is not directed at children. We do not knowingly collect personal information from children. If we learn that we have collected personal information from a child, we will delete it, subject to any record we are legally required to keep.
          </p>

          <h2 id="changes">19. Changes to This Policy</h2>
          <p>
            If this policy changes, the updated version will be posted on this page with a new “Last updated” date. Where a change is significant and the law requires notice, we will provide that notice through the app or the contact details we hold.
          </p>

          <h2 id="contact">20. Contact Information</h2>
          <p>Privacy and grievance contact: {siteConfig.privacyEmail || "Not yet published. Add the official privacy email before relying on this policy for a store listing."}</p>
          <p>General email: {siteConfig.email || "Not yet published."}</p>
          <p>Phone: {siteConfig.phone || "Not yet published."}</p>
          <p>Legal name: {siteConfig.legalName || "Not yet published."}</p>
          <p>Registered address: {siteConfig.businessAddress || "Not yet published."}</p>
          <p>Location stated for the business: {siteConfig.location}.</p>
          <p>
            You can also use the <Link href="/contact">contact form</Link> or the <Link href="/delete-account">account deletion page</Link>.
          </p>
        </Container>
      </article>
    </>
  );
}
