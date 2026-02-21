"use client";
import SubjectsPage from "./SubjectsPage";
import { useData } from "@app/context/DataContext";

export default function Page() {
  const { user } = useData();

  if (!user) return null;

  return <SubjectsPage userId={user.id} />;
}
