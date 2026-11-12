import Link from "next/link";
import type { ReactNode } from "react";

export function cn(...parts: Array<string | false | null | undefined>) {
  return parts.filter(Boolean).join(" ");
}

export function Container({ className, children }: { className?: string; children: ReactNode }) {
  return <div className={cn("mx-auto w-full max-w-6xl px-5 sm:px-6", className)}>{children}</div>;
}

const variants = {
  primary: "bg-orange text-ink hover:bg-[#ff7d3d]",
  secondary: "border border-white/25 bg-white/5 text-white hover:bg-white/10",
  light: "border border-ink/10 bg-white text-ink hover:border-ink/25",
  dark: "bg-ink text-white hover:bg-[#23282d]",
} as const;

type Variant = keyof typeof variants;

export function Button({
  href,
  variant = "primary",
  className,
  children,
  type = "button",
  disabled,
  onClick,
}: {
  href?: string;
  variant?: Variant;
  className?: string;
  children: ReactNode;
  type?: "button" | "submit";
  disabled?: boolean;
  onClick?: () => void;
}) {
  const classNames = cn(
    "inline-flex min-h-11 items-center justify-center gap-2 rounded-full px-5 py-3 text-sm font-semibold transition duration-200 disabled:cursor-not-allowed disabled:opacity-60",
    variants[variant],
    className,
  );

  if (href) {
    const external = href.startsWith("http");
    if (external) {
      return (
        <a className={classNames} href={href} target="_blank" rel="noopener noreferrer">
          {children}
        </a>
      );
    }
    return (
      <Link className={classNames} href={href}>
        {children}
      </Link>
    );
  }

  return (
    <button className={classNames} type={type} disabled={disabled} onClick={onClick}>
      {children}
    </button>
  );
}

export function SectionHeading({
  eyebrow,
  title,
  description,
  id,
  light = false,
  align = "left",
}: {
  eyebrow?: string;
  title: string;
  description?: string;
  id: string;
  light?: boolean;
  align?: "left" | "center";
}) {
  return (
    <div className={cn("max-w-2xl", align === "center" && "mx-auto text-center")}>
      {eyebrow ? (
        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-orange-deep">{eyebrow}</p>
      ) : null}
      <h2
        id={id}
        className={cn(
          "font-display text-3xl tracking-tight sm:text-5xl",
          eyebrow && "mt-3",
          light ? "text-white" : "text-ink",
        )}
      >
        {title}
      </h2>
      {description ? (
        <p className={cn("mt-4 text-base leading-relaxed sm:text-lg", light ? "text-white/75" : "text-muted")}>
          {description}
        </p>
      ) : null}
    </div>
  );
}
