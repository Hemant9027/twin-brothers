import type { Metadata } from "next";
import { Suspense } from "react";
import Confirmation from "@/components/Confirmation";
import { PageHero } from "@/components/PageHero";
import { demoNotice } from "@/lib/wa";

export const metadata: Metadata = {
  title: "Booking Confirmation — Demo Reference",
  description:
    "View a demonstration booking reference created in the Twin Brothers website concept. No real reservation is made and nothing is sent to the restaurant.",
  alternates: { canonical: "/reservations/confirmation" },
  robots: { index: false, follow: true },
};

export default function ConfirmationPage() {
  return (
    <>
      <PageHero
        eyebrow="Your reference"
        title="Booking confirmation."
        intro={demoNotice}
        crumbs={[{ label: "Reservations", href: "/reservations" }, { label: "Confirmation" }]}
      />
      <div className="paper py-14 md:py-20">
        <div className="mx-auto max-w-[70rem] px-5 sm:px-8 md:px-10">
          <Suspense fallback={<div className="py-20 text-center text-mute">Loading…</div>}>
            <Confirmation />
          </Suspense>
        </div>
      </div>
    </>
  );
}
