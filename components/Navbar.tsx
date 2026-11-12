"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { Menu, X } from "lucide-react";
import { navLinks, siteConfig } from "@/lib/config";
import { Button, cn } from "@/components/ui";

export function Navbar() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    if (!open) return;
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpen(false);
    };
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = previous;
      window.removeEventListener("keydown", onKey);
    };
  }, [open]);

  const appHref = siteConfig.googlePlayUrl || "/#app";

  return (
    <header
      className={cn(
        "fixed inset-x-0 top-0 z-50 transition duration-300",
        scrolled || open ? "border-b border-white/10 bg-ink/95 backdrop-blur-md" : "bg-gradient-to-b from-ink/80 to-transparent",
      )}
    >
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between gap-4 px-5 sm:px-6">
        <Link href="/" className="flex min-w-0 items-center gap-2.5" aria-label="NIRMANH360 home">
          <Image src="/brand/logo-mark.png" alt="" width={36} height={36} className="h-9 w-9 shrink-0" priority />
          <span className="font-display text-base font-semibold tracking-tight text-white sm:text-lg">
            NIRMANH<span className="text-orange">360</span>
          </span>
        </Link>

        <nav aria-label="Primary" className="hidden items-center gap-7 md:flex">
          {navLinks.map((link) => {
            const active = link.href === "/" ? pathname === "/" : pathname.startsWith(link.href);
            return (
              <Link
                key={link.href}
                href={link.href}
                aria-current={active ? "page" : undefined}
                className={cn("text-sm font-medium", active ? "text-white" : "text-white/70 hover:text-white")}
              >
                {link.label}
              </Link>
            );
          })}
        </nav>

        <div className="flex items-center gap-2">
          <div className="hidden sm:block">
            <Button href={appHref}>Download App</Button>
          </div>
          <button
            type="button"
            className="menu-button h-11 w-11 items-center justify-center rounded-full text-white"
            aria-expanded={open}
            aria-controls="mobile-nav"
            onClick={() => setOpen((value) => !value)}
          >
            <span className="sr-only">{open ? "Close menu" : "Open menu"}</span>
            {open ? <X aria-hidden /> : <Menu aria-hidden />}
          </button>
        </div>
      </div>

      <div id="mobile-nav" className={cn("mobile-panel border-t border-white/10 bg-ink md:hidden", open && "is-open")}>
        <nav aria-label="Mobile" className="space-y-1 px-5 py-4">
          {navLinks.map((link) => {
            const active = link.href === "/" ? pathname === "/" : pathname.startsWith(link.href);
            return (
              <Link
                key={link.href}
                href={link.href}
                aria-current={active ? "page" : undefined}
                className="block rounded-2xl px-3 py-3 text-base font-medium text-white hover:bg-white/5"
                onClick={() => setOpen(false)}
              >
                {link.label}
              </Link>
            );
          })}
          <div className="px-3 pt-3">
            <Button href={appHref} className="w-full">
              Download App
            </Button>
          </div>
        </nav>
      </div>
    </header>
  );
}
