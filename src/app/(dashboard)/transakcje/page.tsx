import { Metadata } from "next";
import TransactionsPage from "./TransactionsPage";

export const metadata: Metadata = {
  title: "gringott. | transakcje",
};

export default function Page() {
  return <TransactionsPage />;
}
