import { Metadata } from "next";
import AccountsPage from "./AccountsPage";

export const metadata: Metadata = {
  title: "Konta",
};

export default function Page() {
  return <AccountsPage />;
}
