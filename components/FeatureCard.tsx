import { GitCompare, HardHat, Layers, MapPin, Smartphone, Users, type LucideIcon } from "lucide-react";
import type { features } from "@/lib/content";

const icons: Record<(typeof features)[number]["icon"], LucideIcon> = {
  layers: Layers,
  pin: MapPin,
  compare: GitCompare,
  users: Users,
  phone: Smartphone,
  hardhat: HardHat,
};

export function FeatureCard({
  icon,
  title,
  text,
}: {
  icon: (typeof features)[number]["icon"];
  title: string;
  text: string;
}) {
  const Icon = icons[icon];
  return (
    <article className="rounded-3xl border border-white/10 bg-white/[0.04] p-6 transition duration-300 hover:border-orange/50">
      <Icon className="h-6 w-6 text-orange" aria-hidden />
      <h3 className="mt-5 font-display text-xl tracking-tight text-white">{title}</h3>
      <p className="mt-3 text-sm leading-relaxed text-white/70">{text}</p>
    </article>
  );
}
