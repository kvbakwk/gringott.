"use client";
import LoansHistoryPage from "./LoansHistoryPage";
import { useData } from "@app/context/DataContext";

export default function Page() {
  const { user, loans, transactions, subjects, wallets, methods, categories, superCategories, loansReady, transactionsReady, walletsReady, subjectsReady, methodsReady, categoriesReady, superCategoriesReady, reloadLoans, reloadTransactions } = useData();

  if (!user) return null;

  return (
    <LoansHistoryPage
      loans={loans}
      transactions={transactions}
      subjects={subjects}
      wallets={wallets}
      methods={methods}
      categories={categories}
      superCategories={superCategories}
      loansReady={loansReady}
      transactionsReady={transactionsReady}
      walletsReady={walletsReady}
      subjectsReady={subjectsReady}
      methodsReady={methodsReady}
      categoriesReady={categoriesReady}
      superCategoriesReady={superCategoriesReady}
      reloadLoans={reloadLoans}
      reloadTransactions={reloadTransactions}
      userId={user.id}
    />
  );
}
