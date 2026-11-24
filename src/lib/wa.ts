/**
 * Neutral module (no "use client") so both server and client components can
 * read the WhatsApp helper and the concept notice.
 *
 * The number is the one published on the restaurant's own booking page.
 * Messages are always prefilled for a human to send — never auto-sent.
 */

export const WA_NUMBER = "12428105579";

export function waLink(message: string) {
  return `https://wa.me/${WA_NUMBER}?text=${encodeURIComponent(message)}`;
}

export const demoNotice =
  "Personalized website concept by InfyCrest Solutions. Reservations and availability shown are for demonstration purposes only.";
