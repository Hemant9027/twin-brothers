"use client";

import { MapPin, Phone, MessageCircle, ArrowRight } from "lucide-react";
import { LOCATIONS, BRAND } from "@/lib/data";
import { waLink } from "./ui";

export default function LocationActions({ slug }: { slug: string }) {
  const loc = LOCATIONS.find((l) => l.slug === slug);
  if (!loc) return null;

  return (
    <div className="flex flex-wrap gap-3">
      {loc.acceptsReservations ? (
        <a
          href={`/reservations?location=${loc.slug}`}
          className="inline-flex items-center justify-center gap-2 bg-coral px-6 py-3.5 font-sans text-[0.74rem] font-semibold uppercase tracking-[0.16em] text-paper transition-all hover:-translate-y-0.5 hover:bg-coral-dark"
        >
          Reserve a Table <ArrowRight size={14} />
        </a>
      ) : (
        <a
          href={waLink(
            `Hello Twin Brothers! Do you take reservations at your ${loc.name} location?`
          )}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center justify-center gap-2 bg-coral px-6 py-3.5 font-sans text-[0.74rem] font-semibold uppercase tracking-[0.16em] text-paper transition-all hover:-translate-y-0.5 hover:bg-coral-dark"
        >
          <MessageCircle size={15} /> Enquire — no online booking here
        </a>
      )}
      <a
        href={loc.phoneHref}
        className="inline-flex items-center justify-center gap-2 border border-paper/40 px-6 py-3.5 font-sans text-[0.74rem] font-semibold uppercase tracking-[0.16em] transition-colors hover:bg-paper hover:text-ink"
      >
        <Phone size={15} /> {loc.phone}
      </a>
      <a
        href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(loc.mapsQuery)}`}
        target="_blank"
        rel="noopener noreferrer"
        className="inline-flex items-center justify-center gap-2 border border-paper/40 px-6 py-3.5 font-sans text-[0.74rem] font-semibold uppercase tracking-[0.16em] transition-colors hover:bg-paper hover:text-ink"
      >
        <MapPin size={15} /> Directions
      </a>
      {loc.primary && (
        <span className="inline-flex items-center gap-2 px-2 py-3.5 font-sans text-[0.7rem] uppercase tracking-[0.14em] text-paper/65">
          {BRAND.hoursNote}
        </span>
      )}
    </div>
  );
}
