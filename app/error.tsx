"use client";

import { Button, Container } from "@/components/ui";

export default function ErrorPage({ reset }: { error: Error; reset: () => void }) {
  return (
    <section className="bg-paper pt-32 pb-24">
      <Container className="max-w-xl">
        <h1 className="font-display text-4xl tracking-tight text-ink">Something went wrong</h1>
        <p className="mt-4 text-muted">The page could not be loaded. Please try again.</p>
        <div className="mt-8">
          <Button type="button" variant="dark" onClick={reset}>
            Try again
          </Button>
        </div>
      </Container>
    </section>
  );
}
