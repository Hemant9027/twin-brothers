"use client";

import { useMemo, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { motion } from "framer-motion";
import { format, parseISO } from "date-fns";
import { Check, MessageCircle, Printer, Plus, Search, ArrowRight } from "lucide-react";
import { LOCATIONS, BRAND } from "@/lib/data";
import { useStore } from "@/lib/store";
import { Btn, waLink } from "./ui";

const STATUS_COPY: Record<string, string> = {
  confirmed: "Confirmed in demo",
  pending: "Pending in demo",
  completed: "Completed in demo",
  cancelled: "Cancelled in demo",
};

export default function Confirmation() {
  const router = useRouter();
  const params = useSearchParams();
  const ref = params.get("ref");
  const { reservations, ready } = useStore();
  const [lookup, setLookup] = useState("");
  const [searched, setSearched] = useState(false);

  const booking = useMemo(
    () => (ref ? reservations.find((r) => r.ref === ref) : undefined),
    [ref, reservations]
  );

  const filtered = useMemo(() => {
    const q = lookup.trim().toUpperCase();
    if (!q) return reservations.slice(0, 8);
    return reservations.filter((r) => r.ref.includes(q) || r.name.toUpperCase().includes(q));
  }, [lookup, reservations]);

  if (!ready) {
    return <div className="py-24 text-center text-mute">Loading your demo records…</div>;
  }

  if (booking) {
    const loc = LOCATIONS.find((l) => l.slug === booking.locationSlug);
    return (
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: [0.16, 0.9, 0.3, 1] }}
        className="relative border border-ink/20 bg-paper shadow-[0_40px_80px_-50px_rgba(16,45,56,0.8)]"
      >
        <div className="grain absolute inset-0" />
        <div className="relative p-6 sm:p-10">
          <div className="flex flex-wrap items-start justify-between gap-6">
            <div className="flex items-center gap-3">
              <span className="grid h-11 w-11 place-items-center rounded-full bg-sea text-paper">
                <Check size={20} />
              </span>
              <div>
                <p className="eyebrow text-sea">Demo booking created</p>
                <p className="mt-1 font-sans text-[0.8rem] text-mute">
                  {format(new Date(booking.createdAt), "d MMM yyyy · HH:mm")} · stored in this
                  browser only
                </p>
              </div>
            </div>
            <div className="stamp px-4 py-2 font-sans text-[0.8rem] font-bold uppercase tracking-[0.24em]">
              Demo
            </div>
          </div>

          <div className="dash-rule my-8" />

          <div className="flex flex-wrap items-end justify-between gap-6">
            <div>
              <p className="eyebrow text-mute">Reference</p>
              <p className="tabular mt-2 font-display text-[clamp(2.6rem,9vw,5rem)] leading-none">
                {booking.ref}
              </p>
            </div>
            <span className="border border-ink/25 px-3 py-1.5 font-sans text-[0.66rem] font-semibold uppercase tracking-[0.16em]">
              {STATUS_COPY[booking.status]}
            </span>
          </div>

          <div className="mt-9 grid gap-8 border-t border-ink/15 pt-7 sm:grid-cols-2 lg:grid-cols-3">
            <div>
              <p className="eyebrow text-coral">Where</p>
              <p className="mt-2 font-display text-xl">{loc?.name ?? booking.locationSlug}</p>
              <p className="mt-1 text-[0.86rem] leading-relaxed text-mute">
                {loc?.addressVerified ? loc.address : "Address published on request"}
              </p>
              <a href={BRAND.phoneHref} className="mt-2 block font-sans text-[0.86rem] text-sea hover:underline">
                {BRAND.phone}
              </a>
            </div>
            <div>
              <p className="eyebrow text-coral">When</p>
              <p className="tabular mt-2 font-display text-xl">
                {format(parseISO(booking.date), "EEEE d MMMM")}
              </p>
              <p className="tabular mt-1 text-[0.86rem] text-mute">
                {booking.time} · {booking.guests} {booking.guests === 1 ? "guest" : "guests"}
              </p>
              <p className="mt-1 text-[0.86rem] text-mute">{booking.seating}</p>
            </div>
            <div>
              <p className="eyebrow text-coral">Who</p>
              <p className="mt-2 font-display text-xl">{booking.name}</p>
              <p className="mt-1 text-[0.86rem] text-mute">{booking.email}</p>
              <p className="text-[0.86rem] text-mute">{booking.phone}</p>
              <p className="mt-1 font-sans text-[0.78rem] uppercase tracking-[0.12em] text-coral">
                {booking.occasion}
              </p>
            </div>
          </div>

          {booking.notes && (
            <div className="mt-7 border-l-2 border-sea bg-sand/35 px-4 py-3">
              <p className="eyebrow text-mute">Notes</p>
              <p className="mt-1.5 text-[0.9rem] leading-relaxed">{booking.notes}</p>
            </div>
          )}

          <div className="mt-8 border border-coral/45 bg-coral/[0.07] p-4">
            <p className="text-[0.86rem] leading-relaxed text-ink/80">
              <strong className="font-semibold">Not a real reservation.</strong> This reference
              exists only in your browser&apos;s local storage. No restaurant, booking provider
              or member of staff has received it. To actually reserve a table at Twin Brothers,
              call <a href={BRAND.phoneHref} className="underline">{BRAND.phone}</a> or message{" "}
              <a href={waLink("Hello Twin Brothers! I'd like to book a table.")} target="_blank" rel="noopener noreferrer" className="underline">
                {BRAND.whatsapp}
              </a>.
            </p>
          </div>

          <div className="no-print mt-8 flex flex-wrap gap-3">
            <Btn variant="ink" onClick={() => window.print()}>
              <Printer size={14} /> Print confirmation
            </Btn>
            <Btn variant="outline" onClick={() => router.push("/reservations")}>
              <Plus size={14} /> Create another booking
            </Btn>
            <a
              href={waLink(
                `Hello Twin Brothers! I'd like to enquire about a table for ${booking.guests} guests on ${format(
                  parseISO(booking.date),
                  "EEEE d MMMM yyyy"
                )} at ${booking.time}, at your ${loc?.name ?? "Arawak Cay"} restaurant.`
              )}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 bg-sea px-6 py-3.5 font-sans text-[0.74rem] font-semibold uppercase tracking-[0.16em] text-paper transition-all hover:bg-sea-dark"
            >
              <MessageCircle size={15} /> Send to the restaurant
            </a>
          </div>
        </div>
      </motion.div>
    );
  }

  return (
    <div className="border border-ink/15 bg-paper p-6 sm:p-9">
      <p className="eyebrow text-coral">Find a demo booking</p>
      <h2 className="mt-3 text-[clamp(1.7rem,4vw,2.6rem)] leading-tight">
        {ref ? "That reference isn't in this browser." : "No reference passed."}
      </h2>
      <p className="mt-4 max-w-[62ch] text-[0.95rem] leading-relaxed text-mute">
        Demo records live in this browser&apos;s local storage, so a reference created somewhere
        else won&apos;t appear here. Search what has been created in this browser, or start a new
        booking.
      </p>

      <form
        className="mt-7 flex flex-wrap gap-3"
        onSubmit={(e) => {
          e.preventDefault();
          setSearched(true);
        }}
      >
        <label className="relative min-w-[240px] flex-1">
          <Search size={15} className="absolute left-0 top-1/2 -translate-y-1/2 text-mute" />
          <input
            value={lookup}
            onChange={(e) => setLookup(e.target.value)}
            placeholder="TB-XXXXX or guest name"
            aria-label="Search demo references"
            className="w-full border-b border-ink/30 bg-transparent py-2.5 pl-6 font-sans text-[0.95rem] uppercase tracking-wide outline-none focus:border-sea"
          />
        </label>
        <Btn type="submit">Search</Btn>
      </form>

      <ul className="mt-8 border-t border-ink/20">
        {filtered.length === 0 && (
          <li className="py-8 text-center text-[0.92rem] text-mute">
            Nothing matches “{lookup}” in this browser.
            {searched && " Try the full reference with the dash."}
          </li>
        )}
        {filtered.map((r) => (
          <li key={r.id}>
            <Link
              href={`/reservations/confirmation?ref=${r.ref}`}
              className="group flex flex-wrap items-baseline justify-between gap-4 border-b border-ink/12 py-4 transition-colors hover:bg-ink/[0.035]"
            >
              <span>
                <span className="tabular font-display text-[1.2rem] group-hover:text-sea">{r.ref}</span>
                <span className="mt-1 block font-sans text-[0.8rem] text-mute">
                  {r.name} · {r.guests} {r.guests === 1 ? "guest" : "guests"} ·{" "}
                  {LOCATIONS.find((l) => l.slug === r.locationSlug)?.name}
                </span>
              </span>
              <span className="tabular text-right font-sans text-[0.82rem]">
                {format(parseISO(r.date), "EEE d MMM")} · {r.time}
                <span className="mt-1 block text-[0.66rem] uppercase tracking-[0.12em] text-coral">
                  {STATUS_COPY[r.status]}
                </span>
              </span>
            </Link>
          </li>
        ))}
      </ul>

      <div className="mt-8 flex flex-wrap gap-3">
        <Btn href="/reservations" variant="coral">Start a new booking <ArrowRight size={14} /></Btn>
        <Btn href="/demo/dashboard" variant="outline">See them in the dashboard</Btn>
      </div>
    </div>
  );
}
