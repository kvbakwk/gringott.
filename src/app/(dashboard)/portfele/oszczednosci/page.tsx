import { Metadata } from "next";
import SavingsPage from "./SavingsPage";

export const metadata: Metadata = {
  title: "Oszczędności",
};

export default function Page() {
  return <SavingsPage />;
}
