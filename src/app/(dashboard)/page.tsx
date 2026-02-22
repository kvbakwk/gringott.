import { Metadata } from "next";
import HomePage from "./HomePage";

export const metadata: Metadata = {
  title: "gringott. | strona główna",
};

export default function Page() {
  return <HomePage />;
}
