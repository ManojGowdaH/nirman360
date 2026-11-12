"use client";

import { Component, useEffect, useState, type ReactNode } from "react";
import dynamic from "next/dynamic";
import Image from "next/image";
import { MapPin } from "lucide-react";
import { motion, useReducedMotion } from "framer-motion";
import { Button, Container } from "@/components/ui";

const HeroCanvas = dynamic(() => import("@/components/HeroScene"), { ssr: false });

class SceneBoundary extends Component<{ children: ReactNode; onError: () => void }, { failed: boolean }> {
  state = { failed: false };

  static getDerivedStateFromError() {
    return { failed: true };
  }

  componentDidCatch() {
    this.props.onError();
  }

  render() {
    return this.state.failed ? null : this.props.children;
  }
}

function canUseScene() {
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return false;
  if (window.matchMedia("(max-width: 1023px)").matches) return false;
  const nav = navigator as Navigator & { deviceMemory?: number; connection?: { saveData?: boolean } };
  if (nav.connection?.saveData) return false;
  if (nav.deviceMemory && nav.deviceMemory <= 4) return false;
  return true;
}

export function Hero() {
  const reduce = useReducedMotion();
  const [use3d, setUse3d] = useState(false);
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    const update = () => setUse3d(canUseScene());
    const wide = window.matchMedia("(min-width: 1024px)");
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
    wide.addEventListener("change", update);
    reduceMotion.addEventListener("change", update);
    update();
    return () => {
      wide.removeEventListener("change", update);
      reduceMotion.removeEventListener("change", update);
    };
  }, []);

  const showImage = !use3d || failed;

  return (
    <section id="hero" className="relative min-h-[100svh] overflow-hidden bg-[#14181c] text-white" aria-labelledby="hero-title">
      <div className="absolute inset-0">
        {showImage ? (
          <Image
            src="/images/hero-site.jpg"
            alt="A construction site in warm evening light, with a backhoe loader, an excavator, a dump truck, a tower crane and a concrete building frame."
            fill
            priority
            sizes="100vw"
            className="object-cover object-center"
          />
        ) : (
          <p className="sr-only">
            A constructed scene of a backhoe loader, excavator, dump truck, tower crane, materials and a partly built concrete structure.
          </p>
        )}
        {use3d && !failed ? (
          <SceneBoundary onError={() => setFailed(true)}>
            <div className="absolute inset-0" aria-hidden="true">
              <HeroCanvas onFail={() => setFailed(true)} />
            </div>
          </SceneBoundary>
        ) : null}
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-r from-[#15191D] via-[#15191D]/88 to-[#15191D]/20" />
        <div className="pointer-events-none absolute inset-0 shadow-[inset_0_0_140px_rgba(0,0,0,0.35)]" />
      </div>

      <Container className="relative z-10 flex min-h-[100svh] items-center py-28">
        <motion.div
          className="max-w-xl"
          initial={reduce ? false : { y: 16 }}
          animate={{ y: 0 }}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
        >
          <p className="inline-flex items-center gap-2 text-sm text-white/80">
            <MapPin className="h-4 w-4 text-orange" aria-hidden />
            Starting in Bengaluru, India
          </p>
          <h1 id="hero-title" className="mt-5 font-display text-4xl leading-[1.05] tracking-tight sm:text-6xl lg:text-7xl">
            BUILD SMARTER.
            <br />
            BUILD BETTER.
            <br />
            <span className="text-orange">BUILD WITH NIRMANH360.</span>
          </h1>
          <p className="mt-6 max-w-lg text-base leading-relaxed text-white/78 sm:text-lg">
            Your construction resource marketplace. Discover construction materials and equipment, connect with owners and simplify the way you manage your construction requirements.
          </p>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <Button href="/services">Explore Resources</Button>
            <Button href="/partners" variant="secondary">
              Become a Partner
            </Button>
          </div>
        </motion.div>
      </Container>
    </section>
  );
}
