import { Metadata } from "next";
import PiggybanksPage from "./PiggybanksPage";

export const metadata: Metadata = {
  title: "Skarbonki",
};

export default function Page() {
  return <PiggybanksPage />;
}
