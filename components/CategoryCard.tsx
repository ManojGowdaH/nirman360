import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import type { categories } from "@/lib/content";

type Category = (typeof categories)[number];

export function CategoryCard({ category }: { category: Category }) {
  return (
    <article className="group flex h-full flex-col overflow-hidden rounded-3xl bg-white shadow-[0_24px_60px_-36px_rgba(21,25,29,0.55)] transition duration-300 hover:-translate-y-1 motion-reduce:transform-none">
      <div className="relative aspect-[4/3] overflow-hidden">
        <Image
          src={category.image}
          alt={category.imageAlt}
          fill
          sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
          className="object-cover transition duration-700 ease-out group-hover:scale-[1.04] motion-reduce:transition-none motion-reduce:group-hover:scale-100"
        />
      </div>
      <div className="flex flex-1 flex-col p-6">
        <h3 className="font-display text-2xl tracking-tight text-ink">{category.title}</h3>
        <p className="mt-3 flex-1 text-sm leading-relaxed text-muted">{category.summary}</p>
        <Link
          href={`/services#${category.id}`}
          className="mt-6 inline-flex min-h-11 items-center gap-2 text-sm font-semibold text-ink"
        >
          Explore
          <span className="sr-only"> {category.title}</span>
          <ArrowUpRight className="h-4 w-4 transition group-hover:translate-x-0.5 group-hover:-translate-y-0.5 motion-reduce:transition-none" aria-hidden />
        </Link>
      </div>
    </article>
  );
}
