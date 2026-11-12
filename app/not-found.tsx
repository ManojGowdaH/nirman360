import Link from "next/link";
import { Button, Container } from "@/components/ui";

export default function NotFound() {
  return (
    <section className="bg-ink pt-32 pb-24 text-white">
      <Container className="max-w-xl">
        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-ember">404</p>
        <h1 className="mt-3 font-display text-5xl tracking-tight">This page is not on the site.</h1>
        <p className="mt-4 text-white/75">The address may be mistyped, or the page may have moved.</p>
        <div className="mt-8 flex flex-col gap-3 sm:flex-row">
          <Button href="/">Back to home</Button>
          <Link href="/contact" className="inline-flex min-h-11 items-center justify-center rounded-full border border-white/20 px-5 text-sm font-semibold">
            Contact
          </Link>
        </div>
      </Container>
    </section>
  );
}
