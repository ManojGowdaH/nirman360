function read(name: string) {
  return (process.env[name] ?? "").trim();
}

function siteUrl() {
  const raw = read("NEXT_PUBLIC_SITE_URL") || "https://nirman360.in";
  try {
    const url = new URL(raw);
    const local = url.hostname === "localhost" || url.hostname === "127.0.0.1";
    if (url.protocol === "https:" || (local && url.protocol === "http:")) {
      return url.origin;
    }
  } catch {
    /* use the default */
  }
  return "https://nirman360.in";
}

function emailOrEmpty(value: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value) ? value : "";
}

function httpsOrEmpty(value: string) {
  try {
    const url = new URL(value);
    return url.protocol === "https:" ? url.toString() : "";
  } catch {
    return "";
  }
}

function playUrl(value: string) {
  try {
    const url = new URL(value);
    if (url.protocol === "https:" && url.hostname === "play.google.com") {
      return url.toString();
    }
  } catch {
    /* ignore invalid values */
  }
  return "";
}

function whatsappDigits(value: string) {
  const digits = value.replace(/\D/g, "");
  if (digits.length === 10) return `91${digits}`;
  if (digits.length >= 11 && digits.length <= 15) return digits;
  return "";
}

const whatsappNumber = whatsappDigits(read("NEXT_PUBLIC_WHATSAPP_NUMBER"));
const phone = read("NEXT_PUBLIC_CONTACT_PHONE").replace(/[^\d+\s()-]/g, "").slice(0, 24);

export const legalDates = {
  effective: "12 November 2026",
  updated: "12 November 2026",
  iso: "2026-11-12",
} as const;

export const siteConfig = {
  name: "NIRMANH360",
  url: siteUrl(),
  title: "NIRMANH360 | Construction Materials and Equipment Marketplace",
  description:
    "Discover construction materials and equipment through NIRMANH360. Connect with construction resource owners and suppliers in one digital marketplace.",
  location: "Bengaluru, Karnataka, India",
  email: emailOrEmpty(read("NEXT_PUBLIC_CONTACT_EMAIL")),
  privacyEmail: emailOrEmpty(read("NEXT_PUBLIC_PRIVACY_EMAIL") || read("NEXT_PUBLIC_CONTACT_EMAIL")),
  phone,
  whatsappNumber,
  whatsappUrl: whatsappNumber ? `https://wa.me/${whatsappNumber}` : "",
  googlePlayUrl: playUrl(read("NEXT_PUBLIC_GOOGLE_PLAY_URL")),
  legalName: read("NEXT_PUBLIC_LEGAL_NAME").slice(0, 180),
  businessAddress: read("NEXT_PUBLIC_BUSINESS_ADDRESS").slice(0, 240),
  inAppAccountDeletion: read("NEXT_PUBLIC_IN_APP_ACCOUNT_DELETION") === "true",
  social: {
    instagram: httpsOrEmpty(read("NEXT_PUBLIC_INSTAGRAM_URL")),
    linkedin: httpsOrEmpty(read("NEXT_PUBLIC_LINKEDIN_URL")),
    facebook: httpsOrEmpty(read("NEXT_PUBLIC_FACEBOOK_URL")),
  },
} as const;

export const navLinks = [
  { href: "/", label: "Home" },
  { href: "/about", label: "About" },
  { href: "/services", label: "Services" },
  { href: "/partners", label: "Partners" },
  { href: "/contact", label: "Contact" },
] as const;

export function socialLinks() {
  return [
    { label: "Instagram", href: siteConfig.social.instagram },
    { label: "LinkedIn", href: siteConfig.social.linkedin },
    { label: "Facebook", href: siteConfig.social.facebook },
    { label: "WhatsApp", href: siteConfig.whatsappUrl },
  ];
}
