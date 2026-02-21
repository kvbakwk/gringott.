"use client";
import HomePage from "./HomePage";
import { useData } from "@app/context/DataContext";

export default function Page() {
  const { user, wallets, transactions, subjects, categories, walletsReady, transactionsReady, subjectsReady, categoriesReady } = useData();

  if (!user) return null;

  return (
    <HomePage
      user={user}
      wallets={wallets}
      transactions={transactions}
      subjects={subjects}
      categories={categories}
      walletsReady={walletsReady}
      transactionsReady={transactionsReady}
      subjectsReady={subjectsReady}
      categoriesReady={categoriesReady}
    />
  );
}
