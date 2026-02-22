import { Metadata } from "next";
import HistoryPage from "./HistoryPage";

export const metadata: Metadata = {
  title: "Historia operacji",
};

export default function Page() {
  return <HistoryPage />;
}
