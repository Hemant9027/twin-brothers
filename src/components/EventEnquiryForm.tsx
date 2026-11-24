"use client";

import { useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { AlertTriangle, ArrowLeft, ArrowRight, Check, Loader2, MessageCircle } from "lucide-react";
import { EVENT_TYPES, LOCATIONS, SEATING, BRAND } from "@/lib/data";
import { todayISO, useStore } from "@/lib/store";
import { Btn, Reveal, waLink } from "./ui";

const base = {
  type: z.string().min(1),
  locationSlug: z.string().min(1),
  date: z.string().min(1, "Pick a date."),
  time: z.string().min(1, "Pick a preferred time."),
  guests: z
    .string()
    .min(1, "Enter the estimated guest count.")
    .refine(
      (v) => Number(v) >= 2 && Number(v) <= 300,
      "Enter a group size between 2 and 300 — larger parties go through catering."
    ),
  contact: z.string().trim().min(2, "Who should the team reply to?"),
  email: z.string().trim().email("Enter a valid email address."),
  phone: z.string().trim().min(7, "Enter a reachable phone number."),
  seating: z.string(),
  fandb: z.string().max(800).optional(),
  notes: z.string().max(800).optional(),
  cruiseLine: z.string().max(120).optional(),
};

const schemaFull = z.object(base);
const step1Fields = ["type", "locationSlug", "date", "time", "guests"] as const;
const step2Fields = ["contact", "email", "phone", "seating"] as const;

type Form = z.infer<typeof schemaFull>;

const STEPS = ["Occasion", "Contact", "Requirements", "Sent"];

export default function EventEnquiryForm({
  source,
  defaultType,
  cruiseFields = false,
}: {
  source: "events" | "birthdays" | "cruise";
  defaultType?: string;
  cruiseFields?: boolean;
}) {
  const reduce = useReducedMotion();
  const { saveEnquiry, ready } = useStore();
  const [step, setStep] = useState(1);
  const [busy, setBusy] = useState(false);
  const [ref, setRef] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    trigger,
    getValues,
    formState: { errors },
  } = useForm<Form>({
    resolver: zodResolver(schemaFull),
    mode: "onTouched",
    defaultValues: {
      type: defaultType ?? EVENT_TYPES[0],
      locationSlug: "arrawak-cay",
      date: todayISO(),
      time: "18:00",
      guests: String(source === "cruise" ? 20 : 10),
      contact: "",
      email: "",
      phone: "",
      seating: SEATING[0],
      fandb: "",
      notes: "",
      cruiseLine: "",
    },
  });

  const locations = LOCATIONS;

  const next = async () => {
    const ok = await trigger([...step1Fields]);
    if (!ok) {
      setError("Check the highlighted fields before continuing.");
      return;
    }
    setError(null);
    setStep(2);
  };

  const next2 = async () => {
    const ok = await trigger([...step2Fields]);
    if (!ok) {
      setError("Check the highlighted fields before continuing.");
      return;
    }
    setError(null);
    setStep(3);
  };

  const submit = handleSubmit(() => {
    setBusy(true);
    window.setTimeout(() => {
      const v = getValues();
      const rec = saveEnquiry({
        source,
        type: v.type,
        locationSlug: v.locationSlug,
        date: v.date,
        time: v.time,
        guests: Number(v.guests),
        contact: v.contact,
        email: v.email,
        phone: v.phone,
        seating: v.seating,
        fandb: v.fandb ?? "",
        notes: v.notes ?? "",
        cruiseLine: v.cruiseLine,
      });
      setRef(rec.ref);
      setBusy(false);
      setStep(4);
    }, 750);
  });

  const values = getValues();

  if (step === 4 && ref) {
    return (
      <Reveal>
        <div className="relative border border-ink/20 bg-sand/40 p-6 sm:p-9">
          <div className="flex flex-wrap items-start justify-between gap-6">
            <div className="flex items-center gap-3">
              <span className="grid h-11 w-11 place-items-center rounded-full bg-sea text-paper">
                <Check size={20} />
              </span>
              <div>
                <p className="eyebrow text-sea">Enquiry received</p>
                <p className="mt-1 font-sans text-[0.8rem] text-mute">
                  Added to the demo staff dashboard in this browser
                </p>
              </div>
            </div>
            <div className="stamp px-4 py-2 font-sans text-[0.8rem] font-bold uppercase tracking-[0.24em]">
              Demo
            </div>
          </div>

          <div className="dash-rule my-7" />

          <p className="eyebrow text-mute">Enquiry reference</p>
          <p className="tabular mt-2 font-display text-[clamp(2.4rem,8vw,4.4rem)] leading-none">
            {ref}
          </p>

          <dl className="mt-7 grid gap-5 border-t border-ink/15 pt-6 sm:grid-cols-2 lg:grid-cols-3">
            {[
              ["Event type", values.type],
              ["Location", LOCATIONS.find((l) => l.slug === values.locationSlug)?.name ?? "—"],
              ["Date", values.date],
              ["Preferred time", values.time],
              ["Estimated guests", String(values.guests)],
              ["Seating", values.seating],
              ["Contact", values.contact],
              ["Email", values.email],
              ["Phone", values.phone],
              ...(cruiseFields ? [["Cruise ship", values.cruiseLine || "—"]] : []),
            ].map(([k, v]) => (
              <div key={k}>
                <dt className="eyebrow text-mute">{k}</dt>
                <dd className="mt-1 break-words text-[0.95rem]">{v}</dd>
              </div>
            ))}
          </dl>

          {(values.fandb || values.notes) && (
            <div className="mt-6 border-l-2 border-sea bg-paper px-4 py-3">
              <p className="eyebrow text-mute">Requirements</p>
              <p className="mt-1.5 text-[0.9rem] leading-relaxed">
                {[values.fandb, values.notes].filter(Boolean).join(" · ")}
              </p>
            </div>
          )}

          <div className="mt-7 border border-coral/45 bg-coral/[0.07] p-4 text-[0.88rem] leading-relaxed text-ink/80">
            <strong className="font-semibold">Awaiting restaurant approval.</strong> Event
            arrangements and availability must be confirmed by Twin Brothers. This reference
            exists only in this browser and has not been sent anywhere.
          </div>

          <div className="no-print mt-7 flex flex-wrap gap-3">
            <Btn variant="ink" onClick={() => window.print()}>
              Print enquiry
            </Btn>
            <Btn
              variant="outline"
              onClick={() => {
                setStep(1);
                setRef(null);
              }}
            >
              Send another enquiry
            </Btn>
            <a
              href={waLink(
                `Hello Twin Brothers! I'd like to enquire about ${values.type.toLowerCase()} for ${values.guests} guests on ${values.date} at ${values.time}, at your ${LOCATIONS.find((l) => l.slug === values.locationSlug)?.name} restaurant.`
              )}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 bg-sea px-6 py-3.5 font-sans text-[0.74rem] font-semibold uppercase tracking-[0.16em] text-paper transition-all hover:bg-sea-dark"
            >
              <MessageCircle size={15} /> Also message the team
            </a>
          </div>
        </div>
      </Reveal>
    );
  }

  return (
    <div>
      {/* progress */}
      <div className="mb-9">
        <div className="flex items-center justify-between gap-2">
          {STEPS.slice(0, 3).map((s, i) => (
            <span
              key={s}
              className={`flex items-center gap-2 font-sans text-[0.64rem] font-semibold uppercase tracking-[0.16em] ${
                i + 1 <= step ? "text-ink" : "text-ink/30"
              }`}
            >
              <span className="tabular">{String(i + 1).padStart(2, "0")}</span>
              <span className="hidden sm:inline">{s}</span>
            </span>
          ))}
        </div>
        <div className="mt-3 h-px w-full bg-ink/15">
          <motion.div
            className="h-px bg-coral"
            initial={false}
            animate={{ width: `${(step / 3) * 100}%` }}
            transition={{ duration: reduce ? 0 : 0.55, ease: [0.16, 0.9, 0.3, 1] }}
          />
        </div>
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={step}
          initial={reduce ? { opacity: 1 } : { opacity: 0, x: 26 }}
          animate={{ opacity: 1, x: 0 }}
          exit={reduce ? { opacity: 1 } : { opacity: 0, x: -22 }}
          transition={{ duration: 0.38, ease: [0.16, 0.9, 0.3, 1] }}
        >
          {step === 1 && (
            <div className="grid gap-6 sm:grid-cols-2">
              <Field label="Event type" error={errors.type?.message} className="sm:col-span-2">
                <select {...register("type")} className={inputCls}>
                  {(defaultType ? [defaultType, ...EVENT_TYPES.filter((t) => t !== defaultType)] : EVENT_TYPES).map(
                    (t) => (
                      <option key={t}>{t}</option>
                    )
                  )}
                </select>
              </Field>
              <Field label="Preferred location">
                <select {...register("locationSlug")} className={inputCls}>
                  {locations.map((l) => (
                    <option key={l.slug} value={l.slug}>
                      {l.name}
                      {l.acceptsReservations ? "" : " — enquire by phone"}
                    </option>
                  ))}
                </select>
              </Field>
              <Field label="Estimated guest count" error={errors.guests?.message}>
                <input type="number" min={2} max={300} {...register("guests")} className={`${inputCls} tabular`} />
              </Field>
              <Field label="Event date" error={errors.date?.message}>
                <input type="date" min={todayISO()} {...register("date")} className={`${inputCls} tabular`} />
              </Field>
              <Field label="Preferred time" error={errors.time?.message}>
                <input type="time" {...register("time")} className={`${inputCls} tabular`} />
              </Field>
              {cruiseFields && (
                <Field
                  label="Cruise ship name"
                  hint="Optional"
                  error={errors.cruiseLine?.message}
                  className="sm:col-span-2"
                >
                  <input {...register("cruiseLine")} className={inputCls} placeholder="Ship name (as written on your ticket)" />
                </Field>
              )}
              <div className="sm:col-span-2">
                <Btn onClick={next}>
                  Continue <ArrowRight size={14} />
                </Btn>
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="grid gap-6 sm:grid-cols-2">
              <Field label="Contact person" error={errors.contact?.message}>
                <input {...register("contact")} className={inputCls} autoComplete="name" placeholder="Who should the team reply to?" />
              </Field>
              <Field label="Email" error={errors.email?.message}>
                <input type="email" {...register("email")} className={inputCls} autoComplete="email" placeholder="you@example.com" />
              </Field>
              <Field label="Phone" error={errors.phone?.message}>
                <input type="tel" {...register("phone")} className={inputCls} autoComplete="tel" placeholder="+1 242 000 0000" />
              </Field>
              <Field label="Seating preference">
                <select {...register("seating")} className={inputCls}>
                  {SEATING.map((s) => (
                    <option key={s}>{s}</option>
                  ))}
                </select>
              </Field>
              <div className="sm:col-span-2 flex flex-wrap gap-3">
                <Btn variant="outline" onClick={() => setStep(1)}>
                  <ArrowLeft size={14} /> Back
                </Btn>
                <Btn onClick={next2}>
                  Continue <ArrowRight size={14} />
                </Btn>
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="grid gap-6 sm:grid-cols-2">
              <Field
                label="Food & beverage requirements"
                hint={`${(getValues("fandb") ?? "").length}/800`}
                className="sm:col-span-2"
                error={errors.fandb?.message}
              >
                <textarea
                  rows={4}
                  {...register("fandb")}
                  className={inputCls}
                  placeholder="Set menus, daiquiri towers, allergens, cake, timings…"
                />
              </Field>
              <Field
                label="Special requests"
                hint={`${(getValues("notes") ?? "").length}/800`}
                className="sm:col-span-2"
                error={errors.notes?.message}
              >
                <textarea
                  rows={4}
                  {...register("notes")}
                  className={inputCls}
                  placeholder="Accessibility, décor, timing around a ship departure…"
                />
              </Field>

              {error && (
                <p className="sm:col-span-2 flex items-start gap-2 border-l-2 border-coral bg-coral/8 px-3 py-2 font-sans text-[0.82rem] text-coral-dark">
                  <AlertTriangle size={15} className="mt-0.5 shrink-0" /> {error}
                </p>
              )}

              <div className="sm:col-span-2 border border-ink/15 bg-sand/35 p-4">
                <p className="eyebrow text-coral">Before you send</p>
                <p className="mt-2 text-[0.88rem] leading-relaxed text-ink/80">
                  Event arrangements, group sizes and availability must be approved by the
                  restaurant. This form files a demo enquiry into your browser only — to actually
                  ask, call{" "}
                  <a href={BRAND.phoneHref} className="underline">{BRAND.phone}</a>, catering{" "}
                  <a href={BRAND.phoneHref} className="underline">{BRAND.phone}</a>, or message{" "}
                  <a href={waLink("Hello Twin Brothers! I'd like to enquire about an event.")} target="_blank" rel="noopener noreferrer" className="underline">
                    {BRAND.whatsapp}
                  </a>.
                </p>
              </div>

              <div className="sm:col-span-2 flex flex-wrap gap-3">
                <Btn variant="outline" onClick={() => setStep(2)}>
                  <ArrowLeft size={14} /> Back
                </Btn>
                <Btn onClick={submit} disabled={busy || !ready}>
                  {busy ? (
                    <>
                      <Loader2 size={14} className="animate-spin" /> Sending
                    </>
                  ) : (
                    <>
                      Send enquiry <ArrowRight size={14} />
                    </>
                  )}
                </Btn>
              </div>
            </div>
          )}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}

const inputCls =
  "mt-1.5 w-full border-b border-ink/30 bg-transparent py-2.5 font-sans text-[0.98rem] text-ink outline-none transition-colors placeholder:text-ink/30 focus:border-sea";

function Field({
  label,
  children,
  error,
  hint,
  className = "",
}: {
  label: string;
  children: React.ReactNode;
  error?: string;
  hint?: string;
  className?: string;
}) {
  return (
    <label className={`block ${className}`}>
      <span className="eyebrow flex items-baseline justify-between gap-3 text-mute">
        <span>{label}</span>
        {hint && (
          <span className="font-sans text-[0.6rem] normal-case tracking-normal text-ink/35">{hint}</span>
        )}
      </span>
      {children}
      {error && <span className="mt-1.5 block font-sans text-[0.74rem] text-coral-dark">{error}</span>}
    </label>
  );
}
