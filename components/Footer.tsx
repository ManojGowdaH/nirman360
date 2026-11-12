import Image from "next/image";
import Link from "next/link";
import { siteConfig, socialLinks } from "@/lib/config";

const company = [
  { href: "/about", label: "About" },
  { href: "/services", label: "Services" },
  { href: "/partners", label: "Partners" },
  { href: "/contact", label: "Contact" },
];

const support = [
  { href: "/faq", label: "FAQ" },
  { href: "/privacy-policy", label: "Privacy Policy" },
  { href: "/terms-and-conditions", label: "Terms and Conditions" },
  { href: "/delete-account", label: "Delete Account" },
];

export function Footer() {
  return (
    <footer className="bg-ink text-white">
      <div className="mx-auto grid max-w-6xl gap-10 px-5 py-16 sm:px-6 md:grid-cols-2 lg:grid-cols-4">
        <div>
          <Link href="/" className="flex items-center gap-2.5" aria-label="NIRMANH360 home">
            <Image src="/brand/logo-mark.png" alt="" width={36} height={36} className="h-9 w-9" />
            <span className="font-display text-lg font-semibold tracking-tight">
              NIRMANH<span className="text-orange">360</span>
            </span>
          </Link>
          <p className="mt-4 max-w-xs text-sm leading-relaxed text-white/70">
            A construction resource marketplace for materials and equipment, starting in Bengaluru.
          </p>
        </div>

        <nav aria-label="Company">
          <h2 className="text-sm font-semibold">Company</h2>
          <ul className="mt-4 space-y-2">
            {company.map((link) => (
              <li key={link.href}>
                <Link href={link.href} className="text-sm text-white/75 hover:text-white">
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <nav aria-label="Support">
          <h2 className="text-sm font-semibold">Support</h2>
          <ul className="mt-4 space-y-2">
            {support.map((link) => (
              <li key={link.href}>
                <Link href={link.href} className="text-sm text-white/75 hover:text-white">
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <div>
          <h2 className="text-sm font-semibold">Connect</h2>
          <ul className="mt-4 space-y-2">
            {socialLinks().map((link) => (
              <li key={link.label}>
                {link.href ? (
                  <a href={link.href} className="text-sm text-white/75 hover:text-white" target="_blank" rel="noopener noreferrer">
                    {link.label}
                  </a>
                ) : (
                  <span className="text-sm text-white/40">
                    {link.label}
                    <span className="sr-only">, link not published yet</span>
                  </span>
                )}
              </li>
            ))}
          </ul>
        </div>
      </div>
      <div className="border-t border-white/10">
        <div className="mx-auto flex max-w-6xl flex-col gap-2 px-5 py-6 text-sm text-white/60 sm:flex-row sm:items-center sm:justify-between sm:px-6">
          <p>© 2026 NIRMANH360. All rights reserved.</p>
          <p>{siteConfig.location}</p>
        </div>
      </div>
    </footer>
  );
}
