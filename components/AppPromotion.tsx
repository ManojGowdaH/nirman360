import QRCode from "qrcode";
import Image from "next/image";
import { siteConfig } from "@/lib/config";
import { getAppScreenshots } from "@/lib/screenshots";
import { Button, Container, SectionHeading } from "@/components/ui";

export async function AppPromotion() {
  const screenshots = getAppScreenshots();
  const playUrl = siteConfig.googlePlayUrl;
  const qr = playUrl
    ? await QRCode.toString(playUrl, {
        type: "svg",
        margin: 1,
        color: { dark: "#15191D", light: "#FFFFFF" },
      })
    : "";

  return (
    <section id="app" className="scroll-mt-24 bg-ink py-20 text-white sm:py-28" aria-labelledby="app-title">
      <Container className="grid items-center gap-12 lg:grid-cols-[0.9fr_1.1fr]">
        <div className="mx-auto w-full max-w-[280px]">
          <div className="rounded-[2rem] border border-white/15 bg-black p-3 shadow-2xl">
            <div className="relative aspect-[9/19] overflow-hidden rounded-[1.4rem] bg-mist text-ink">
              {screenshots[0] ? (
                <Image src={screenshots[0]} alt="NIRMANH360 application screen" fill className="object-cover" sizes="280px" />
              ) : (
                <div className="flex h-full flex-col justify-end p-5">
                  <p className="font-display text-2xl tracking-tight">NIRMANH360</p>
                  <p className="mt-2 text-sm leading-relaxed text-muted">Application screens are not published on this page yet.</p>
                </div>
              )}
            </div>
          </div>
        </div>
        <div>
          <SectionHeading
            id="app-title"
            light
            eyebrow="Mobile app"
            title="Construction Resources at Your Fingertips"
            description="Explore the NIRMANH360 mobile experience and manage your construction resource requirements digitally."
          />
          {playUrl ? (
            <div className="mt-8 flex flex-col items-start gap-6 sm:flex-row sm:items-center">
              <Button href={playUrl}>Download on Google Play</Button>
              <div className="rounded-2xl bg-white p-3" dangerouslySetInnerHTML={{ __html: qr }} aria-label="QR code for the Google Play listing" />
            </div>
          ) : (
            <div className="mt-8 inline-flex min-h-11 items-center rounded-full border border-white/20 px-5 py-3 text-sm font-semibold text-white">
              Coming soon
            </div>
          )}
          <p className="mt-5 max-w-xl text-sm leading-relaxed text-white/60">
            {playUrl
              ? "The button and QR code use the configured Google Play listing. This page does not show ratings or download counts."
              : "A public Google Play listing has not been configured. This page will show a download button and QR code only after a real Play Store link is added."}
          </p>
        </div>
      </Container>
    </section>
  );
}
