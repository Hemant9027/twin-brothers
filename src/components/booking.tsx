"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import {
  addMonths,
  eachDayOfInterval,
  endOfMonth,
  format,
  isSameMonth,
  startOfMonth,
  isBefore,
  parseISO,
} from "date-fns";
import { ChevronLeft, ChevronRight, Minus, Plus, Loader2, Check } from "lucide-react";
import { LOCATIONS } from "@/lib/data";
import { padDate, todayISO, useStore, type Slot } from "@/lib/store";
import { Reveal } from "./ui";

export function fmtLong(iso: string) {
  return format(parseISO(iso), "EEEE d MMMM yyyy");
}

/* ---------------------------------------------------------------- */
/* Calendar                                                           */
/* ---------------------------------------------------------------- */

export function Calendar({
  value,
  onChange,
  blockedKeys,
}: {
  value: string;
  onChange: (iso: string) => void;
  blockedKeys?: string[];
}) {
  const today = useMemo(() => new Date(), []);
  const [cursor, setCursor] = useState(() => startOfMonth(new Date()));

  const days = eachDayOfInterval({
    start: startOfMonth(cursor),
    end: endOfMonth(cursor),
  });
  const lead = days[0].getDay();
  const todayIso = todayISO();

  return (
    <div className="w-full select-none">
      <div className="flex items-center justify-between gap-3">
        <button
          type="button"
          onClick={() => setCursor((c) => addMonths(c, -1))}
          disabled={isSameMonth(cursor, today)}
          aria-label="Previous month"
          className="grid h-10 w-10 place-items-center border border-ink/20 transition-colors hover:bg-ink hover:text-paper disabled:opacity-30 disabled:hover:bg-transparent disabled:hover:text-ink"
        >
          <ChevronLeft size={16} />
        </button>
        <p className="eyebrow tabular text-ink">{format(cursor, "MMMM yyyy")}</p>
        <button
          type="button"
          onClick={() => setCursor((c) => addMonths(c, 1))}
          aria-label="Next month"
          className="grid h-10 w-10 place-items-center border border-ink/20 transition-colors hover:bg-ink hover:text-paper"
        >
          <ChevronRight size={16} />
        </button>
      </div>

      <div className="mt-4 grid grid-cols-7 gap-px text-center">
        {["S", "M", "T", "W", "T", "F", "S"].map((d, i) => (
          <span
            key={i}
            className="pb-2 font-sans text-[0.62rem] font-semibold uppercase tracking-[0.14em] text-mute"
          >
            {d}
          </span>
        ))}
        {Array.from({ length: lead }).map((_, i) => (
          <span key={`pad-${i}`} />
        ))}
        {days.map((d) => {
          const iso = padDate(d);
          const past = isBefore(d, today) && iso !== todayIso;
          const blocked = blockedKeys?.includes(iso);
          const disabled = past || blocked;
          const selected = iso === value;
          return (
            <button
              key={iso}
              type="button"
              disabled={disabled}
              onClick={() => onChange(iso)}
              aria-label={format(d, "EEEE d MMMM yyyy")}
              aria-pressed={selected}
              className={[
                "tabular relative aspect-square min-h-11 font-sans text-[0.88rem] transition-all duration-200",
                selected
                  ? "bg-coral font-semibold text-paper shadow-[0_8px_20px_-10px_rgba(216,121,88,1)]"
                  : disabled
                    ? "cursor-not-allowed text-ink/25 line-through"
                    : "hover:bg-ink hover:text-paper",
              ].join(" ")}
            >
              {format(d, "d")}
              {iso === todayIso && !selected && (
                <span className="absolute inset-x-2 bottom-1 h-px bg-sea" />
              )}
            </button>
          );
        })}
      </div>
      {blockedKeys && blockedKeys.length > 0 && (
        <p className="mt-4 font-sans text-[0.72rem] leading-relaxed text-mute">
          Struck-through dates are blocked in this demo (the restaurant is marked
          unavailable for that day).
        </p>
      )}
    </div>
  );
}

/* ---------------------------------------------------------------- */
/* Guests                                                             */
/* ---------------------------------------------------------------- */

export function GuestStepper({
  value,
  onChange,
  min = 1,
  max = 20,
}: {
  value: number;
  onChange: (n: number) => void;
  min?: number;
  max?: number;
}) {
  return (
    <div className="flex items-center justify-between gap-4">
      <button
        type="button"
        onClick={() => onChange(Math.max(min, value - 1))}
        disabled={value <= min}
        aria-label="Fewer guests"
        className="grid h-10 w-10 place-items-center border border-ink/20 transition-colors hover:bg-ink hover:text-paper disabled:opacity-30"
      >
        <Minus size={15} />
      </button>
      <span className="tabular min-w-14 text-center font-display text-3xl leading-none">
        {value}
      </span>
      <button
        type="button"
        onClick={() => onChange(Math.min(max, value + 1))}
        disabled={value >= max}
        aria-label="More guests"
        className="grid h-10 w-10 place-items-center border border-ink/20 transition-colors hover:bg-ink hover:text-paper disabled:opacity-30"
      >
        <Plus size={15} />
      </button>
    </div>
  );
}

/* ---------------------------------------------------------------- */
/* Slots                                                              */
/* ---------------------------------------------------------------- */

const stateLabel: Record<string, string> = {
  open: "Available",
  limited: "Limited",
  booked: "Fully booked",
  closed: "Not offered",
};

export function SlotList({
  slots,
  value,
  onSelect,
  compact = false,
}: {
  slots: Slot[];
  value?: string;
  onSelect: (t: string) => void;
  compact?: boolean;
}) {
  if (slots.length === 0) {
    return (
      <p className="border border-dashed border-ink/25 px-4 py-5 font-sans text-[0.84rem] leading-relaxed text-mute">
        No sample times to show for this date. Try another date — or call{" "}
        <a className="text-sea underline" href="tel:+12426063600">
          242-606-3600
        </a>
        .
      </p>
    );
  }
  const counts = slots.reduce(
    (a, s) => ({ ...a, [s.state]: (a[s.state] ?? 0) + 1 }),
    {} as Record<string, number>
  );
  return (
    <div>
      <div className="flex flex-wrap items-center gap-x-5 gap-y-2 font-sans text-[0.7rem] uppercase tracking-[0.12em] text-mute">
        <span className="inline-flex items-center gap-2">
          <span className="h-2 w-2 rounded-full bg-sea" /> {counts.open ?? 0} available
        </span>
        <span className="inline-flex items-center gap-2">
          <span className="h-2 w-2 rounded-full bg-coral" /> {counts.limited ?? 0} limited
        </span>
        <span className="inline-flex items-center gap-2">
          <span className="h-2 w-2 rounded-full bg-ink/25" /> {counts.booked ?? 0} fully booked
        </span>
      </div>
      <div
        className={`mt-4 grid gap-2 ${
          compact ? "grid-cols-3 sm:grid-cols-5" : "grid-cols-3 sm:grid-cols-4 lg:grid-cols-6"
        }`}
      >
        {slots.map((s) => {
          const disabled = s.state === "booked" || s.state === "closed";
          const active = value === s.time;
          return (
            <button
              key={s.time}
              type="button"
              disabled={disabled}
              onClick={() => onSelect(s.time)}
              aria-label={`${s.time} — ${stateLabel[s.state]}`}
              aria-pressed={active}
              className={[
                "group relative flex flex-col items-start gap-0.5 border px-3 py-2.5 text-left transition-all duration-200",
                active
                  ? "border-coral bg-coral text-paper"
                  : disabled
                    ? "cursor-not-allowed border-ink/12 bg-ink/[0.03] text-ink/30"
                    : s.state === "limited"
                      ? "border-coral/45 bg-coral/[0.07] hover:border-coral hover:bg-coral hover:text-paper"
                      : "border-ink/20 hover:border-ink hover:bg-ink hover:text-paper",
              ].join(" ")}
            >
              <span className="tabular font-sans text-[0.95rem] font-semibold">{s.time}</span>
              <span
                className={`font-sans text-[0.58rem] uppercase tracking-[0.12em] ${
                  active ? "text-paper/85" : disabled ? "" : "text-mute group-hover:text-paper/70"
                }`}
              >
                {stateLabel[s.state]}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}

/* ---------------------------------------------------------------- */
/* Hero reservation ticket                                            */
/* ---------------------------------------------------------------- */

export function HeroTicket() {
  const router = useRouter();
  const { slotsFor, availability, ready } = useStore();
  const [locationSlug, setLocationSlug] = useState("arrawak-cay");
  const [date, setDate] = useState(todayISO());
  const [guests, setGuests] = useState(2);
  const [checked, setChecked] = useState(false);
  const [loading, setLoading] = useState(false);
  const [time, setTime] = useState<string | null>(null);

  const locations = LOCATIONS.filter((l) => l.acceptsReservations);
  const blocked = availability.blockedDates
    .filter((k) => k.startsWith(`${locationSlug}|`))
    .map((k) => k.split("|")[1]);

  const slots = ready ? slotsFor(locationSlug, date) : [];

  const check = () => {
    setLoading(true);
    setChecked(false);
    setTime(null);
    window.setTimeout(() => {
      setLoading(false);
      setChecked(true);
    }, 550);
  };

  const go = () => {
    const q = new URLSearchParams({
      location: locationSlug,
      date,
      guests: String(guests),
      ...(time ? { time } : {}),
      step: time ? "2" : "1",
    });
    router.push(`/reservations?${q.toString()}`);
  };

  return (
    <div className="ticket-edge relative bg-paper shadow-[0_36px_70px_-42px_rgba(16,45,56,0.75)]">
      <div className="grain absolute inset-0" />
      <div className="relative px-5 py-5 sm:px-7 sm:py-6">
        <div className="flex flex-wrap items-baseline justify-between gap-2">
          <p className="eyebrow text-coral">Check availability</p>
          <p className="font-sans text-[0.66rem] uppercase tracking-[0.12em] text-mute">
            Simulated · no real table is held
          </p>
        </div>

        <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-[1.3fr_1fr_1fr_auto_auto] lg:items-end">
          <label className="block">
            <span className="eyebrow text-mute">Location</span>
            <select
              value={locationSlug}
              onChange={(e) => {
                setLocationSlug(e.target.value);
                setChecked(false);
              }}
              className="mt-1.5 w-full appearance-none border-b border-ink/30 bg-transparent py-2 font-sans text-[0.95rem] text-ink outline-none focus:border-sea"
            >
              {locations.map((l) => (
                <option key={l.slug} value={l.slug}>
                  {l.name}
                </option>
              ))}
            </select>
          </label>

          <label className="block">
            <span className="eyebrow text-mute">Date</span>
            <input
              type="date"
              value={date}
              min={todayISO()}
              onChange={(e) => {
                setDate(e.target.value);
                setChecked(false);
              }}
              className="tabular mt-1.5 w-full border-b border-ink/30 bg-transparent py-2 font-sans text-[0.95rem] text-ink outline-none focus:border-sea"
            />
          </label>

          <div className="block">
            <span className="eyebrow text-mute">Guests</span>
            <div className="mt-1.5 flex items-center gap-3 border-b border-ink/30 py-1">
              <button
                type="button"
                aria-label="Fewer guests"
                onClick={() => setGuests((g) => Math.max(1, g - 1))}
                className="grid h-7 w-7 place-items-center border border-ink/25 hover:bg-ink hover:text-paper"
              >
                <Minus size={13} />
              </button>
              <span className="tabular min-w-6 text-center font-sans text-[0.95rem] font-semibold">
                {guests}
              </span>
              <button
                type="button"
                aria-label="More guests"
                onClick={() => setGuests((g) => Math.min(20, g + 1))}
                className="grid h-7 w-7 place-items-center border border-ink/25 hover:bg-ink hover:text-paper"
              >
                <Plus size={13} />
              </button>
            </div>
          </div>

          <button
            type="button"
            onClick={check}
            disabled={loading}
            className="inline-flex items-center justify-center gap-2 bg-ink px-6 py-3.5 font-sans text-[0.72rem] font-semibold uppercase tracking-[0.16em] text-paper transition-all hover:bg-sea disabled:opacity-60 lg:col-span-1"
          >
            {loading ? <Loader2 size={15} className="animate-spin" /> : null}
            {loading ? "Checking" : "Check Availability"}
          </button>

          <button
            type="button"
            onClick={go}
            className="inline-flex items-center justify-center gap-2 bg-coral px-6 py-3.5 font-sans text-[0.72rem] font-semibold uppercase tracking-[0.16em] text-paper transition-all hover:bg-coral-dark"
          >
            {time ? `Continue ${time}` : "Book a Table"}
          </button>
        </div>

        {checked && (
          <Reveal delay={0.02} y={10} className="mt-6">
            <div className="dash-rule mb-4" />
            <div className="flex flex-wrap items-baseline justify-between gap-3">
              <p className="font-display text-lg">
                {slots.filter((s) => s.state !== "booked" && s.state !== "closed").length > 0
                  ? "Sample times open on this date"
                  : "No sample times on this date"}
              </p>
              <p className="tabular font-sans text-[0.72rem] uppercase tracking-[0.12em] text-mute">
                {LOCATIONS.find((l) => l.slug === locationSlug)?.name} · {fmtLong(date)} ·{" "}
                {guests} {guests === 1 ? "guest" : "guests"}
              </p>
            </div>
            <div className="mt-3">
              <SlotList slots={slots} value={time ?? undefined} onSelect={setTime} compact />
            </div>
            <p className="mt-4 font-sans text-[0.7rem] leading-relaxed text-mute">
              Times shown are a simulated schedule for this concept demo, generated from the
              restaurant&apos;s published 11am–9pm service. They are not verified booking times.
            </p>
          </Reveal>
        )}
      </div>
    </div>
  );
}

export function LoadingDots() {
  return (
    <span className="inline-flex items-center gap-1">
      <Check size={14} />
    </span>
  );
}
