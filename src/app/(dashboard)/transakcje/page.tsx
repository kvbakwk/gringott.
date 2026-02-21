"use client";
import TransactionsPage from "./TransactionsPage";
import { useData } from "@app/context/DataContext";

export default function Page() {
  const { user, wallets, transactions, methods, subjects, superCategories, categories, walletsReady, transactionsReady, methodsReady, subjectsReady, superCategoriesReady, categoriesReady, reloadWallets, reloadTransactions } = useData();

  if (!user) return null;

  return (
    <TransactionsPage
      wallets={wallets}
      transactions={transactions}
      methods={methods}
      subjects={subjects.filter((subject) => subject.normal)}
      superCategories={superCategories}
      categories={categories}
      walletsReady={walletsReady}
      transactionsReady={transactionsReady}
      methodsReady={methodsReady}
      subjectsReady={subjectsReady}
      superCategoriesReady={superCategoriesReady}
      categoriesReady={categoriesReady}
      reloadWallets={reloadWallets}
      reloadTransactions={reloadTransactions}
      userId={user.id}
    />
  );
}
