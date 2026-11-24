import HomeClient from "@/components/home";

export const metadata = {
  title:
    "Twin Brothers Seafood & Steakhouse · Bahamian Seafood & World Famous Daiquiris · Arawak Cay, Nassau",
  description:
    "Fresh Bahamian seafood, steak and cold daiquiris at the Fish Fry, Arawak Cay, Nassau. Conch salad, cracked conch, whole snapper, group dining and table requests minutes from Prince George Wharf cruise port.",
  alternates: { canonical: "/" },
};

export default function HomePage() {
  return <HomeClient />;
}
