"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { format, parseISO, isBefore } from "date-fns";
import {
  ArrowLeft,
  ArrowRight,
  AlertTriangle,
  Loader2,
  MessageCircle,
} from "lucide-react";
import { LOCATIONS, OCCASIONS, SEATING, BRAND } from "@/lib/data";
import { padDate, todayISO, useStore } from "@/lib/store";
import { Calendar, GuestStepper, SlotList, fmtLong } from "./booking";
import { Btn, Reveal, waLink } from "./ui";

const detailsSchema = z.object({
  name: z.string().trim().min(2, "Please enter the name for the table."),
  email: z.string().trim().email("Enter a valid email address."),
  phone: z.string().trim().min(7, "Enter a phone number we can reach you on."),
  occasion: z.string(),
  seating: z.string(),
  notes: z.string().max(600, "Keep notes under 600 characters.").optional(),
});

type Details = z.infer<typeof detailsSchema>;

const STEPS = ["Select", "Guest details", "Review", "Confirmed"];

export default function BookingFlow() {
  const router = useRouter();
  const params = useSearchParams();
  const reduce = useReducedMotion();
  const { slotsFor, availability, saveReservation, ready } = useStore();

  const initialLocation = params.get("location") ?? "arrawak-cay";
  const initialDate = params.get("date") ?? todayISO();
  const initialGuests = Number(params.get("guests") ?? 2);
  const initialTime = params.get("time");
  const initialStep = Number(params.get("step") ?? 1);

  const [step, setStep] = useState(
    initialTime ? Math.max(2, Math.min(3, initialStep)) : 1
  );
  const [locationSlug, setLocationSlug] = useState(
    LOCATIONS.find((l) => l.slug === initialLocation)?.acceptsReservations
      ? initialLocation
      : "arrawak-cay"
  );
  const [date, setDate] = useState(initialDate);
  const [guests, setGuests] = useState(
    Number.isFinite(initialGuests) ? Math.min(20, Math.max(1, initialGuests)) : 2
  );
  const [time, setTime] = useState<string | null>(initialTime);
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const [ref, setRef] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
    getValues,
    setValue,
  } = useForm<Details>({
    resolver: zodResolver(detailsSchema),
    defaultValues: {
      name: "",
      email: "",
      phone: "",
      occasion: OCCASIONS[0],
      seating: SEATING[0],
      notes: "",
    },
    mode: "onTouched",
  });

  const locations = LOCATIONS.filter((l) => l.acceptsReservations);
  const blocked = availability.blockedDates
    .filter((k) => k.startsWith(`${locationSlug}|`))
    .map((k) => k.split("|")[1]);
  const slots = ready ? slotsFor(locationSlug, date) : [];
  const selectedSlot = slots.find((s) => s.time === time);

  const canContinue =
    !!time && (!selectedSlot || (selectedSlot.state !== "booked" && selectedSlot.state !== "closed"));

  const nextFromSelect = () => {
    if (!time) {
      setError("Choose a time slot to continue.");
      return;
    }
    const s = slots.find((x) => x.time === time);
    if (!s || s.state === "booked" || s.state === "closed") {
      setError("That time has just filled in this demo. Please pick another.");
      return;
    }
    setError(null);
    setStep(2);
  };

  const submitDetails = handleSubmit(() => {
    setError(null);
    const s = slots.find((x) => x.time === time);
    if (!s || s.state === "booked" || s.state === "closed") {
      setError("That time is no longer available. Go back and choose another.");
      setStep(1);
      return;
    }
    setStep(3);
  });

  const confirm = () => {
    setBusy(true);
    window.setTimeout(() => {
      const d = getValues();
      const record = saveReservation({
        locationSlug,
        date,
        time: time!,
        guests,
        seating: d.seating,
        occasion: d.occasion,
        notes: d.notes ?? "",
        name: d.name,
        email: d.email,
        phone: d.phone,
      });
      setRef(record.ref);
      setBusy(false);
      setStep(4);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }, 800);
  };

  const loc = locations.find((l) => l.slug === locationSlug)!;
  const details = getValues();

  const progress = step / 4;

  return (
    <div className="bg-paper">
      {/* progress */}
      <div className="mb-10">
        <div className="flex items-center justify-between gap-2">
          {STEPS.map((s, i) => (
            <button
              key={s}
              type="button"
              onClick={() => {
                if (i + 1 < step) setStep(i + 1);
              }}
              disabled={i + 1 > step}
              className={`flex items-center gap-2 font-sans text-[0.64rem] font-semibold uppercase tracking-[0.16em] transition-colors ${
                i + 1 <= step ? "text-ink" : "text-ink/30"
              } ${i + 1 < step ? "cursor-pointer hover:text-sea" : "cursor-default"}`}
            >
              <span className="tabular">{String(i + 1).padStart(2, "0")}</span>
              <span className="hidden sm:inline">{s}</span>
            </button>
          ))}
        </div>
        <div className="mt-3 h-px w-full bg-ink/15">
          <motion.div
            className="h-px bg-coral"
            initial={false}
            animate={{ width: `${progress * 100}%` }}
            transition={{ duration: reduce ? 0 : 0.6, ease: [0.16, 0.9, 0.3, 1] }}
          />
        </div>
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={step}
          initial={reduce ? { opacity: 1 } : { opacity: 0, x: 28 }}
          animate={{ opacity: 1, x: 0 }}
          exit={reduce ? { opacity: 1 } : { opacity: 0, x: -28 }}
          transition={{ duration: 0.4, ease: [0.16, 0.9, 0.3, 1] }}
        >
          {/* ------------------------------------------------ STEP 1 */}
          {step === 1 && (
            <div className="grid gap-10 lg:grid-cols-[minmax(0,340px)_1fr]">
              <div>
                <p className="eyebrow text-coral">Step 01 · Reservation</p>
                <h3 className="mt-3 text-[2rem] leading-tight">Pick a day</h3>
                <div className="mt-6 border border-ink/15 p-4">
                  <Calendar value={date} onChange={(d) => { setDate(d); setTime(null); setError(null); }} blockedKeys={blocked} />
                </div>

                <div className="mt-6">
                  <span className="eyebrow text-mute">Location</span>
                  <select
                    value={locationSlug}
                    onChange={(e) => { setLocationSlug(e.target.value); setTime(null); }}
                    className="mt-1.5 w-full appearance-none border-b border-ink/30 bg-transparent py-2 font-sans text-[0.95rem] outline-none focus:border-sea"
                  >
                    {locations.map((l) => (
                      <option key={l.slug} value={l.slug}>{l.name}</option>
                    ))}
                  </select>
                </div>

                <div className="mt-6 flex items-end justify-between gap-4 border border-ink/15 px-4 py-3">
                  <div>
                    <span className="eyebrow text-mute">Party size</span>
                    <p className="mt-1 font-sans text-[0.74rem] text-mute">Maximum 20 in this demo</p>
                  </div>
                  <GuestStepper value={guests} onChange={setGuests} />
                </div>
              </div>

              <div>
                <p className="eyebrow text-coral">Step 01 · Reservation</p>
                <h3 className="mt-3 text-[2rem] leading-tight">Pick a time</h3>
                <p className="mt-3 text-[0.95rem] leading-relaxed text-mute">
                  {fmtLong(date)} · {loc.name} · {guests}{" "}
                  {guests === 1 ? "guest" : "guests"}
                </p>

                <div className="mt-6 border border-ink/15 p-5">
                  {ready ? (
                    <SlotList slots={slots} value={time ?? undefined} onSelect={(t) => { setTime(t); setError(null); }} />
                  ) : (
                    <div className="flex items-center gap-2 font-sans text-[0.84rem] text-mute">
                      <Loader2 size={15} className="animate-spin" /> Loading sample availability…
                    </div>
                  )}
                </div>

                <p className="mt-4 font-sans text-[0.72rem] leading-relaxed text-mute">
                  {selectedSlot ? (
                    <>
                      Selected <span className="tabular font-semibold text-ink">{time}</span> —{" "}
                      {selectedSlot.left} of {slotsFor(locationSlug, date).length > 0 ? 6 : 6} sample
                      tables still shown at this time.
                    </>
                  ) : (
                    "Availability is simulated with a deterministic schedule and your own demo bookings. It never changes between visits unless you book or block something here."
                  )}
                </p>

                {error && (
                  <p className="mt-4 flex items-start gap-2 border-l-2 border-coral bg-coral/8 px-3 py-2 font-sans text-[0.82rem] text-coral-dark">
                    <AlertTriangle size={15} className="mt-0.5 shrink-0" /> {error}
                  </p>
                )}

                <div className="mt-7 flex flex-wrap gap-3">
                  <Btn onClick={nextFromSelect} disabled={!canContinue}>
                    Continue to guest details <ArrowRight size={14} />
                  </Btn>
                  <Btn href="/menu" variant="outline">Look at the menu first</Btn>
                </div>
              </div>
            </div>
          )}

          {/* ------------------------------------------------ STEP 2 */}
          {step === 2 && (
            <div className="grid gap-10 lg:grid-cols-[1fr_minmax(0,320px)]">
              <form onSubmit={submitDetails} noValidate>
                <p className="eyebrow text-coral">Step 02 · Guest details</p>
                <h3 className="mt-3 text-[2rem] leading-tight">Who&apos;s the table for?</h3>

                <div className="mt-8 grid gap-6 sm:grid-cols-2">
                  <Field label="Full name" error={errors.name?.message} required>
                    <input {...register("name")} className={inputCls} placeholder="Name for the reservation" autoComplete="name" />
                  </Field>
                  <Field label="Email" error={errors.email?.message} required>
                    <input {...register("email")} type="email" className={inputCls} placeholder="you@example.com" autoComplete="email" />
                  </Field>
                  <Field label="Phone" error={errors.phone?.message} required>
                    <input {...register("phone")} type="tel" className={inputCls} placeholder="+1 242 000 0000" autoComplete="tel" />
                  </Field>
                  <Field label="Special occasion" hint="Choose Birthday and the team sets the table up for it.">
                    <select {...register("occasion")} className={inputCls}>
                      {OCCASIONS.map((o) => <option key={o}>{o}</option>)}
                    </select>
                  </Field>
                  <Field label="Seating preference" className="sm:col-span-2">
                    <select {...register("seating")} className={inputCls}>
                      {SEATING.map((s) => <option key={s}>{s}</option>)}
                    </select>
                  </Field>
                  <Field label="Additional notes" error={errors.notes?.message} className="sm:col-span-2" hint={`${(getValues("notes") ?? "").length}/600`}>
                    <textarea {...register("notes")} rows={4} className={inputCls} placeholder="Allergies, pushchair, celebrating something…" />
                  </Field>
                </div>

                {error && (
                  <p className="mt-5 flex items-start gap-2 border-l-2 border-coral bg-coral/8 px-3 py-2 font-sans text-[0.82rem] text-coral-dark">
                    <AlertTriangle size={15} className="mt-0.5 shrink-0" /> {error}
                  </p>
                )}

                <div className="mt-8 flex flex-wrap gap-3">
                  <Btn variant="outline" onClick={() => setStep(1)}><ArrowLeft size={14} /> Back</Btn>
                  <Btn type="submit">Review booking <ArrowRight size={14} /></Btn>
                </div>
              </form>

              <SummaryCard
                location={loc.name}
                date={date}
                time={time ?? "—"}
                guests={guests}
              />
            </div>
          )}

          {/* ------------------------------------------------ STEP 3 */}
          {step === 3 && (
            <div className="grid gap-10 lg:grid-cols-[1fr_minmax(0,320px)]">
              <div>
                <p className="eyebrow text-coral">Step 03 · Review</p>
                <h3 className="mt-3 text-[2rem] leading-tight">Check it over</h3>

                <dl className="mt-8 divide-y divide-ink/12 border-y border-ink/15">
                  <Row k="Restaurant" v={`${BRAND.name} — ${loc.name}`} />
                  <Row k="Address" v={loc.addressVerified ? loc.address : "Published on request — call the restaurant"} />
                  <Row k="Date" v={fmtLong(date)} />
                  <Row k="Time" v={time ?? "—"} />
                  <Row k="Guests" v={`${guests} ${guests === 1 ? "guest" : "guests"}`} />
                  <Row k="Name" v={details.name} />
                  <Row k="Email" v={details.email} />
                  <Row k="Phone" v={details.phone} />
                  <Row k="Occasion" v={details.occasion} />
                  <Row k="Seating" v={details.seating} />
                  <Row k="Notes" v={details.notes?.trim() ? details.notes : "—"} />
                </dl>

                <div className="mt-6 border border-coral/40 bg-coral/[0.06] p-4">
                  <p className="eyebrow text-coral">Demonstration only</p>
                  <p className="mt-2 text-[0.86rem] leading-relaxed text-ink/80">
                    This creates a demo record in your browser&apos;s local storage. It is not
                    sent to Twin Brothers, and no table at any restaurant is being reserved.
                    To actually book, call{" "}
                    <a href={BRAND.phoneHref} className="underline">{BRAND.phone}</a> or message{" "}
                    <a href={waLink("Hello Twin Brothers! I'd like to book a table.")} target="_blank" rel="noopener noreferrer" className="underline">
                      {BRAND.whatsapp}
                    </a>.
                  </p>
                </div>

                {error && (
                  <p className="mt-5 flex items-start gap-2 border-l-2 border-coral bg-coral/8 px-3 py-2 font-sans text-[0.82rem] text-coral-dark">
                    <AlertTriangle size={15} className="mt-0.5 shrink-0" /> {error}
                  </p>
                )}

                <div className="mt-8 flex flex-wrap gap-3">
                  <Btn variant="outline" onClick={() => setStep(2)}><ArrowLeft size={14} /> Back</Btn>
                  <Btn onClick={confirm} disabled={busy}>
                    {busy ? <><Loader2 size={14} className="animate-spin" /> Confirming</> : <>Confirm demo booking <ArrowRight size={14} /></>}
                  </Btn>
                </div>
              </div>

              <SummaryCard location={loc.name} date={date} time={time ?? "—"} guests={guests} />
            </div>
          )}

          {/* ------------------------------------------------ STEP 4 */}
          {step === 4 && (
            <Reveal>
              <div className="border border-ink/15 bg-sand/40 p-6 sm:p-9">
                <div className="flex flex-wrap items-start justify-between gap-6">
                  <div>
                    <p className="eyebrow text-coral">Demo reference</p>
                    <p className="tabular mt-2 font-display text-[clamp(2.4rem,7vw,4rem)] leading-none">
                      {ref ?? "—"}
                    </p>
                  </div>
                  <div className="stamp px-4 py-2 font-sans text-[0.8rem] font-bold uppercase tracking-[0.24em]">
                    Demo
                  </div>
                </div>

                <div className="dash-rule my-7" />

                <div className="grid gap-6 sm:grid-cols-2">
                  <div>
                    <p className="eyebrow text-mute">Where</p>
                    <p className="mt-1 font-display text-xl">{loc.name}</p>
                    <p className="mt-1 text-[0.88rem] text-mute">{loc.addressVerified ? loc.address : "Address published on request"}</p>
                  </div>
                  <div>
                    <p className="eyebrow text-mute">When</p>
                    <p className="tabular mt-1 font-display text-xl">{fmtLong(date)}</p>
                    <p className="tabular mt-1 text-[0.88rem] text-mute">{time} · {guests} {guests === 1 ? "guest" : "guests"}</p>
                  </div>
                </div>

                <div className="mt-7 border border-ink/15 bg-paper p-4 text-[0.86rem] leading-relaxed text-ink/80">
                  <strong className="font-semibold">This is a demonstration confirmation.</strong>{" "}
                  It does not represent a confirmed table at Twin Brothers Seafood &amp;
                  Steakhouse. Your record is stored only in this browser.
                </div>

                <div className="mt-7 flex flex-wrap gap-3">
                  <Btn onClick={() => router.push("/reservations/confirmation")}><ArrowRight size={14} /> Open confirmation page</Btn>
                  <Btn variant="outline" onClick={() => { setStep(1); setTime(null); setRef(null); }}>Create another booking</Btn>
                  <Btn variant="outline" onClick={() => window.print()}>Print this screen</Btn>
                </div>

                <a
                  href={waLink(
                    `Hello Twin Brothers! I'd like to enquire about a table for ${guests} guests on ${fmtLong(date)} at ${time}, at your ${loc.name} restaurant.`
                  )}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-5 inline-flex items-center gap-2 font-sans text-[0.76rem] font-semibold uppercase tracking-[0.14em] text-sea hover:underline"
                >
                  <MessageCircle size={15} /> Send this request to the restaurant on WhatsApp
                </a>
              </div>
            </Reveal>
          )}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}

/* ---------------------------------------------------------------- */

const inputCls =
  "mt-1.5 w-full border-b border-ink/30 bg-transparent py-2.5 font-sans text-[0.98rem] text-ink outline-none transition-colors placeholder:text-ink/30 focus:border-sea";

function Field({
  label,
  children,
  error,
  hint,
  required,
  className = "",
}: {
  label: string;
  children: React.ReactNode;
  error?: string;
  hint?: string;
  required?: boolean;
  className?: string;
}) {
  return (
    <label className={`block ${className}`}>
      <span className="eyebrow flex items-baseline justify-between gap-3 text-mute">
        <span>
          {label} {required && <span className="text-coral">*</span>}
        </span>
        {hint && <span className="font-sans text-[0.6rem] normal-case tracking-normal text-ink/35">{hint}</span>}
      </span>
      {children}
      {error && <span className="mt-1.5 block font-sans text-[0.74rem] text-coral-dark">{error}</span>}
    </label>
  );
}

function Row({ k, v }: { k: string; v: string }) {
  return (
    <div className="grid grid-cols-1 gap-1 py-3 sm:grid-cols-[180px_1fr] sm:gap-4">
      <dt className="eyebrow text-mute">{k}</dt>
      <dd className="tabular break-words text-[0.95rem] text-ink">{v}</dd>
    </div>
  );
}

function SummaryCard({
  location,
  date,
  time,
  guests,
}: {
  location: string;
  date: string;
  time: string;
  guests: number;
}) {
  return (
    <aside className="h-fit border border-ink/15 bg-sand/45 p-5">
      <p className="eyebrow text-coral">Your selection</p>
      <p className="mt-4 font-display text-2xl leading-tight">{location}</p>
      <div className="dash-rule my-4" />
      <dl className="space-y-3 text-[0.9rem]">
        <div className="flex justify-between gap-4">
          <dt className="text-mute">Date</dt>
          <dd className="tabular text-right">{format(parseISO(date), "EEE d MMM yyyy")}</dd>
        </div>
        <div className="flex justify-between gap-4">
          <dt className="text-mute">Time</dt>
          <dd className="tabular text-right">{time}</dd>
        </div>
        <div className="flex justify-between gap-4">
          <dt className="text-mute">Guests</dt>
          <dd className="tabular text-right">{guests}</dd>
        </div>
      </dl>
      <p className="mt-5 font-sans text-[0.7rem] leading-relaxed text-mute">
        {BRAND.serviceCharge}
      </p>
    </aside>
  );
}
