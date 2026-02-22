import { Metadata } from "next";
import LoansSummaryPage from "./LoansSummaryPage";

export const metadata: Metadata = {
  title: "Należności",
};

export default function Page() {
  return <LoansSummaryPage />;
}
