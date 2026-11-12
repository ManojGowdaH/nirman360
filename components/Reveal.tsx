"use client";

import { useEffect, useRef } from "react";

export function Reveal({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const element = ref.current;
    if (!element) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    element.classList.add("translate-y-3", "opacity-0");
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        element.classList.remove("translate-y-3", "opacity-0");
        element.classList.add("translate-y-0", "opacity-100");
        observer.disconnect();
      },
      { rootMargin: "0px 0px -10% 0px" },
    );
    observer.observe(element);
    return () => observer.disconnect();
  }, []);

  return (
    <div ref={ref} className={`transition duration-700 ease-out motion-reduce:transition-none ${className ?? ""}`}>
      {children}
    </div>
  );
}
