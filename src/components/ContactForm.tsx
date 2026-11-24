"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Check, Loader2, MessageCircle, Copy, AlertTriangle } from "lucide-react";
import { BRAND, LOCATIONS } from "@/lib/data";
import { waLink, Btn } from "./ui";

const schema = z.object({
  name: z.string().trim().min(2, "Please tell us your name."),
  email: z.string().trim().email("Enter a valid email address."),
  phone: z.string().trim().min(7, "Enter a phone number."),
  topic: z.string(),
  locationSlug: z.string(),
  message: z.string().trim().min(10, "A little more detail, please — at least 10 characters."),
});

type Form = z.infer<typeof schema>;

const inputCls =
  "mt-1.5 w-full border-b border-ink/30 bg-transparent py-2.5 font-sans text-[0.98rem] text-ink outline-none transition-colors placeholder:text-ink/30 focus:border-sea";

export default function ContactForm() {
  const [sent, setSent] = useState(false);
  const [busy, setBusy] = useState(false);
  const [copied, setCopied] = useState(false);

  const {
    register,
    handleSubmit,
    getValues,
    formState: { errors },
  } = useForm<Form>({
    resolver: zodResolver(schema),
    mode: "onTouched",
    defaultValues: {
      name: "",
      email: "",
      phone: "",
      topic: "General question",
      locationSlug: "arrawak-cay",
      message: "",
    },
  });

  const submit = handleSubmit(() => {
    setBusy(true);
    window.setTimeout(() => {
      setBusy(false);
      setSent(true);
    }, 700);
  });

  const compose = () => {
    const v = getValues();
    return `Hello Twin Brothers! ${v.message}\n\n— ${v.name} · ${v.phone} · ${v.email} · Topic: ${v.topic} · ${LOCATIONS.find((l) => l.slug === v.locationSlug)?.name}`;
  };

  if (sent) {
    const text = compose();
    return (
      <div className="border border-ink/20 bg-sand/40 p-6 sm:p-8">
        <div className="flex items-start gap-3">
          <span className="grid h-11 w-11 shrink-0 place-items-center rounded-full bg-sea text-paper">
            <Check size={20} />
          </span>
          <div>
            <p className="eyebrow text-sea">Message prepared</p>
            <h3 className="mt-2 text-[1.7rem] leading-tight">Your note is ready to send.</h3>
          </div>
        </div>
        <div className="dash-rule my-6" />
        <p className="text-[0.92rem] leading-relaxed text-ink/80">
          Nothing was transmitted — this concept has no backend. Copy the message, or open
          WhatsApp with it prefilled so <strong className="font-semibold">you</strong> decide
          whether to send.
        </p>
        <pre className="mt-5 max-h-52 overflow-auto whitespace-pre-wrap border border-ink/15 bg-paper p-4 font-sans text-[0.86rem] leading-relaxed text-ink/85">
          {text}
        </pre>
        <div className="mt-6 flex flex-wrap gap-3">
          <a
            href={waLink(text)}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center gap-2 bg-sea px-6 py-3.5 font-sans text-[0.74rem] font-semibold uppercase tracking-[0.16em] text-paper transition-all hover:bg-sea-dark"
          >
            <MessageCircle size={15} /> Open in WhatsApp
          </a>
          <a
            href={BRAND.phoneHref}
            className="inline-flex items-center justify-center gap-2 border border-ink/30 px-6 py-3.5 font-sans text-[0.74rem] font-semibold uppercase tracking-[0.16em] transition-colors hover:bg-ink hover:text-paper"
          >
            Call {BRAND.phone}
          </a>
          <Btn
            variant="outline"
            onClick={() => {
              navigator.clipboard?.writeText(text).then(
                () => setCopied(true),
                () => setCopied(false)
              );
            }}
          >
            <Copy size={14} /> {copied ? "Copied" : "Copy message"}
          </Btn>
          <Btn variant="outline" onClick={() => setSent(false)}>Edit</Btn>
        </div>
      </div>
    );
  }

  return (
    <form onSubmit={submit} noValidate className="grid gap-6 sm:grid-cols-2">
      <label className="block">
        <span className="eyebrow text-mute">Name *</span>
        <input {...register("name")} className={inputCls} autoComplete="name" placeholder="Your name" />
        {errors.name && <span className="mt-1.5 block font-sans text-[0.74rem] text-coral-dark">{errors.name.message}</span>}
      </label>
      <label className="block">
        <span className="eyebrow text-mute">Email *</span>
        <input type="email" {...register("email")} className={inputCls} autoComplete="email" placeholder="you@example.com" />
        {errors.email && <span className="mt-1.5 block font-sans text-[0.74rem] text-coral-dark">{errors.email.message}</span>}
      </label>
      <label className="block">
        <span className="eyebrow text-mute">Phone *</span>
        <input type="tel" {...register("phone")} className={inputCls} autoComplete="tel" placeholder="+1 242 000 0000" />
        {errors.phone && <span className="mt-1.5 block font-sans text-[0.74rem] text-coral-dark">{errors.phone.message}</span>}
      </label>
      <label className="block">
        <span className="eyebrow text-mute">Topic</span>
        <select {...register("topic")} className={inputCls}>
          {["General question", "Table request", "Group or event", "Catering", "Menu & allergens", "Lost property", "Press or partnerships"].map(
            (t) => (
              <option key={t}>{t}</option>
            )
          )}
        </select>
      </label>
      <label className="block sm:col-span-2">
        <span className="eyebrow text-mute">Location</span>
        <select {...register("locationSlug")} className={inputCls}>
          {LOCATIONS.map((l) => (
            <option key={l.slug} value={l.slug}>{l.name}</option>
          ))}
        </select>
      </label>
      <label className="block sm:col-span-2">
        <span className="eyebrow flex items-baseline justify-between gap-3 text-mute">
          <span>Message *</span>
          <span className="font-sans text-[0.6rem] normal-case tracking-normal text-ink/35">
            {getValues("message")?.length ?? 0}/800
          </span>
        </span>
        <textarea
          rows={5}
          maxLength={800}
          {...register("message")}
          className={inputCls}
          placeholder="What would you like to ask?"
        />
        {errors.message && <span className="mt-1.5 block font-sans text-[0.74rem] text-coral-dark">{errors.message.message}</span>}
      </label>

      <div className="sm:col-span-2 flex flex-wrap items-center gap-4">
        <Btn type="submit" disabled={busy}>
          {busy ? (
            <>
              <Loader2 size={14} className="animate-spin" /> Preparing
            </>
          ) : (
            "Prepare message"
          )}
        </Btn>
        <p className="flex items-start gap-2 max-w-[46ch] font-sans text-[0.76rem] leading-relaxed text-mute">
          <AlertTriangle size={14} className="mt-0.5 shrink-0 text-coral" />
          Nothing is emailed or stored. You stay in control of what is actually sent.
        </p>
      </div>
    </form>
  );
}
