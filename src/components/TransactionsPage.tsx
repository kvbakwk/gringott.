"use client";

import { WalletT } from "@app/utils/db-actions/wallet";
import { TransactionT } from "@app/utils/db-actions/transaction";

import { useRouter } from "next/navigation";

import { parseDate, parseMoney, parseTime } from "@app/utils/parser";
import { CircularProgress } from "./material/Progress";
import { Fab } from "./material/Fab";
import { Icon } from "./material/Icon";

export default function TransactionsPage({
  wallets,
  transactions,
  walletsReady,
  transactionsReady,
}: {
  wallets: WalletT[];
  transactions: TransactionT[];
  walletsReady: boolean;
  transactionsReady: boolean;
}) {
  const router = useRouter();

  return (
    <div className="flex flex-col w-full h-full bg-surface rounded-tl-2xl shadow-sm">
      <div className="flex justify-center items-end gap-[20px] font-bold text-primary text-md w-full h-[50px] pb-[10px]">
        <div className="flex justify-center items-center w-[200px]">DATA</div>
        <div className="flex justify-center items-center w-[160px]">KWOTA</div>
        <div className="flex justify-center items-center w-[200px]">OPIS</div>
        <div className="flex justify-center items-center w-[200px]">
          DRUGA STRONA
        </div>
        <div className="flex justify-center items-center w-[200px]">
          KATEGORIA
        </div>
        <div className="flex justify-center items-center w-[120px]">
          PORTFEL
        </div>
        <div className="flex justify-center items-center w-[150px]">METODA</div>
      </div>
      <div
        className={`flex w-full h-[calc(100vh-160px)] pb-[30px] overflow-y-auto scroll-none ${
          walletsReady && transactionsReady
            ? "flex-col"
            : "justify-center items-center"
        }`}
      >
        {transactions
          .sort((a, b) => b.date.getTime() - a.date.getTime())
          .map((transaction) => (
            <div
              className={`flex justify-center items-center gap-[20px] font-normal text-on-surface-variant text-base w-full h-[30px]`}
              key={transaction.id}
            >
              <div className="flex justify-center items-center gap-[6px] w-[200px]">
                <div>{parseDate(transaction.date)}</div>
                <div className="text-[15px]">{parseTime(transaction.date)}</div>
              </div>
              <div
                className={`flex justify-center items-center font-semibold text-lg w-[160px] ${
                  transaction.income ? "text-green-800" : "text-red-800"
                }`}
              >
                {parseMoney(transaction.amount)} zł
              </div>
              <div className="flex justify-center items-center truncate w-[200px]">
                {transaction.description}
              </div>
              <div className="flex justify-center items-center truncate w-[200px]">
                {transaction.counterparty}
              </div>
              <div className="flex justify-center items-center truncate w-[200px]">
                {transaction.category}
              </div>
              <div className="flex justify-center items-center truncate w-[120px]">
                {wallets.filter(
                  (wallet: WalletT) => wallet.id === transaction.wallet_id
                )[0].name ?? "gotówka"}
              </div>
              <div className="flex justify-center items-center w-[150px]">
                {transaction.method}
              </div>
            </div>
          ))}
        <div className={`${walletsReady && transactionsReady && " hidden"}`}>
          <CircularProgress indeterminate />
        </div>
      </div>
      <div className="absolute bottom-10 right-10">
        <Fab lowered onClick={() => router.push("/nowa-transakcja")}>
          <Icon slot="icon">add</Icon>
        </Fab>
      </div>
    </div>
  );
}
