import type { Metadata } from "next";
import { Suspense } from "react";
import BookingFlow from "@/components/BookingFlow";
import Link from "next/link";
import { MessageCircle, Phone, Clock, ShieldAlert } from "lucide-react";
import { PageHero } from "@/components/PageHero";
import { BRAND, HOURS_CONFLICT } from "@/lib/data";
import { Btn } from "@/components/ui";
import { waLink, demoNotice } from "@/lib/wa";



export const metadata: Metadata = {
  title: "Reserve a Table — Demo Booking Experience",
  description:
    "Pick a location, date and time, choose your party size and complete a four-step table request for Twin Brothers Seafood & Steakhouse, Arawak Cay, Nassau. A demonstration booking flow by InfyCrest Solutions.",
  alternates: { canonical: "/reservations" },
  keywords: ["Twin Brothers reservations Nassau", "Arawak Cay restaurant booking", "Nassau seafood restaurant reservations"],
};

export default function ReservationsPage() {
  return (
    <>
      <PageHero
        eyebrow="Request a table"
        title="Hold a seat on the water."
        intro="Four steps: pick the day and time, tell us who's coming, review it, and get a reference. Every availability figure you see here is simulated for this concept — no request leaves your browser."
        image="/images/official/2026/09/home-gallery-dining-room.jpg"
        crumbs={[{ label: "Reservations" }]}
      >
        <div className="flex flex-wrap gap-4 font-sans text-[0.74rem] uppercase tracking-[0.14em] text-paper/75">
          <span className="inline-flex items-center gap-2"><Clock size={14} /> {BRAND.hoursNote}</span>
          <a href={BRAND.phoneHref} className="inline-flex items-center gap-2 hover:text-paper">
            <Phone size={14} /> {BRAND.phone}
          </a>
          <a href={waLink("Hello Twin Brothers! I'd like to book a table.")} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 hover:text-paper">
            <MessageCircle size={14} /> WhatsApp {BRAND.whatsapp}
          </a>
        </div>
      </PageHero>

      <div className="paper py-14 md:py-20">
        <div className="mx-auto grid max-w-[88rem] grid-cols-12 gap-x-6 gap-y-12 px-5 sm:px-8 md:px-10">
          <div className="col-span-12 lg:col-span-8 xl:col-span-9">
            <Suspense
              fallback={
                <div className="flex items-center gap-2 py-20 font-sans text-[0.9rem] text-mute">
                  Loading the booking demo…
                </div>
              }
            >
              <BookingFlow />
            </Suspense>
          </div>

          <aside className="col-span-12 lg:col-span-4 xl:col-span-3">
            <div className="lg:sticky lg:top-[120px] space-y-5">
              <div className="border border-coral/45 bg-coral/[0.07] p-5">
                <p className="flex items-center gap-2 eyebrow text-coral">
                  <ShieldAlert size={14} /> Demonstration only
                </p>
                <p className="mt-3 text-[0.86rem] leading-relaxed text-ink/80">{demoNotice}</p>
              </div>

              <div className="border border-ink/15 p-5">
                <p className="eyebrow text-mute">Prefer to reach them now?</p>
                <a href={BRAND.phoneHref} className="mt-3 flex items-center gap-2 font-display text-xl hover:text-sea">
                  <Phone size={16} /> {BRAND.phone}
                </a>
                <a
                  href={waLink("Hello Twin Brothers! I'd like to book a table.")}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-3 flex items-center gap-2 font-display text-xl text-sea hover:underline"
                >
                  <MessageCircle size={16} /> WhatsApp {BRAND.whatsapp}
                </a>
                <p className="mt-3 text-[0.8rem] leading-relaxed text-mute">
                  The restaurant&apos;s own booking page sends requests straight to the team.
                  This concept does not.
                </p>
                <a
                  href="https://twinbrothersbahamas.com/booking/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-3 inline-block font-sans text-[0.7rem] font-semibold uppercase tracking-[0.14em] text-coral hover:underline"
                >
                  Open the official booking page →
                </a>
              </div>

              <div className="border border-ink/15 p-5">
                <p className="eyebrow text-mute">Opening hours · conflicting sources</p>
                <ul className="mt-3 space-y-3">
                  {HOURS_CONFLICT.map((h) => (
                    <li key={h.source} className="border-b border-ink/12 pb-3 last:border-0">
                      <p className="tabular font-sans text-[0.86rem] font-semibold">{h.value}</p>
                      <p className="mt-0.5 font-sans text-[0.72rem] leading-snug text-mute">{h.source}</p>
                      <p
                        className={`mt-1 font-sans text-[0.66rem] uppercase tracking-[0.12em] ${
                          h.status === "Used on this concept" ? "text-sea" : "text-coral"
                        }`}
                      >
                        {h.status}
                      </p>
                    </li>
                  ))}
                </ul>
                <p className="mt-3 text-[0.76rem] leading-relaxed text-mute">
                  We show the official site&apos;s hours and flag the rest rather than combine
                  them.
                </p>
              </div>

              <div className="border border-ink/15 p-5">
                <p className="eyebrow text-mute">Also here</p>
                <ul className="mt-3 space-y-2 text-[0.88rem]">
                  <li><Link href="/events" className="link-underline hover:text-sea">Group dining &amp; events</Link></li>
                  <li><Link href="/events/birthdays" className="link-underline hover:text-sea">Birthday celebrations</Link></li>
                  <li><Link href="/cruise-visitors" className="link-underline hover:text-sea">Cruise visitor dining</Link></li>
                  <li><Link href="/reservations/confirmation" className="link-underline hover:text-sea">Find your demo booking</Link></li>
                </ul>
              </div>

              <Btn href="/menu" variant="outline" className="w-full">Look at the menu</Btn>
            </div>
          </aside>
        </div>
      </div>
    </>
  );
}
