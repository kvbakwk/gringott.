import { Metadata } from "next";
import SubjectsPage from "./SubjectsPage";

export const metadata: Metadata = {
  title: "Podmioty",
};

export default function Page() {
  return <SubjectsPage />;
}
