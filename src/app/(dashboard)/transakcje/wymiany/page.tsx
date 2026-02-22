import { Metadata } from "next";
import TradesPage from "./TradesPage";

export const metadata: Metadata = {
  title: "Wymiany",
};

export default function Page() {
  return <TradesPage />;
}
