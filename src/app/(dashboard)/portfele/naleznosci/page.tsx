"use client";
import LoansSummaryPage from "./LoansSummaryPage";
import { useData } from "@app/context/DataContext";

export default function Page() {
  const { user, loans, transactions, subjects, wallets, loansReady, transactionsReady, walletsReady, subjectsReady, reloadLoans, reloadTransactions, reloadWallets } = useData();

  if (!user) return null;

  return (
    <LoansSummaryPage
      loans={loans}
      transactions={transactions}
      subjects={subjects}
      wallets={wallets}
      loansReady={loansReady}
      transactionsReady={transactionsReady}
      walletsReady={walletsReady}
      subjectsReady={subjectsReady}
      reloadLoans={reloadLoans}
      reloadTransactions={reloadTransactions}
      reloadWallets={reloadWallets}
      userId={user.id}
    />
  );
}
