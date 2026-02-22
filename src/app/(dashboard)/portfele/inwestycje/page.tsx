import { Metadata } from "next";
import InvestmentsPage from "./InvestmentsPage";

export const metadata: Metadata = {
  title: "Inwestycje",
};

export default function Page() {
  return <InvestmentsPage />;
}
