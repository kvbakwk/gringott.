import { Metadata } from "next";
import GoalsPage from "./GoalsPage";

export const metadata: Metadata = {
  title: "Cele",
};

export default function Page() {
  return <GoalsPage />;
}
