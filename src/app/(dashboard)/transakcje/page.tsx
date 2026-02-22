import { Metadata } from "next";
import TransactionsPage from "./TransactionsPage";

export const metadata: Metadata = {
  title: "Transakcje",
};

export default function Page() {
  return <TransactionsPage />;
}
