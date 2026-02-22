import { Metadata } from "next";
import TransfersPage from "./TransfersPage";

export const metadata: Metadata = {
  title: "Transfery",
};

export default function Page() {
  return <TransfersPage />;
}
