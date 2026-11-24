import Link from "next/link";
import { Btn } from "@/components/ui";

export default function NotFound() {
  return (
    <div className="paper flex min-h-[70svh] items-center py-20">
      <div className="mx-auto w-full max-w-[88rem] px-5 sm:px-8 md:px-10">
        <p className="eyebrow text-coral">404 · Not on the menu</p>
        <h1 className="mt-5 max-w-[16ch] text-[clamp(2.4rem,7vw,5.5rem)] leading-[0.98]">
          That page walked out.
        </h1>
        <p className="mt-6 max-w-[56ch] text-[1.02rem] leading-relaxed text-mute">
          The link you followed isn&apos;t part of this concept. Try the menu, the booking flow,
          or head back to the Fish Fry.
        </p>
        <div className="mt-9 flex flex-wrap gap-3">
          <Btn href="/" variant="coral">Back to the homepage</Btn>
          <Btn href="/menu" variant="outline">Explore the menu</Btn>
          <Btn href="/reservations" variant="ink">Reserve a table</Btn>
        </div>
        <p className="mt-10 font-sans text-[0.8rem] text-mute">
          Looking for the restaurant&apos;s own site?{" "}
          <a
            href="https://twinbrothersbahamas.com/"
            target="_blank"
            rel="noopener noreferrer"
            className="underline hover:text-sea"
          >
            twinbrothersbahamas.com
          </a>
        </p>
      </div>
    </div>
  );
}
