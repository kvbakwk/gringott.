import { Metadata } from "next";
import LoansHistoryPage from "./LoansHistoryPage";

export const metadata: Metadata = {
  title: "Spłaty",
};

export default function Page() {
  return <LoansHistoryPage />;
}
