import { getUser } from "@app/api/user/get";
import { getWallets } from "@app/api/wallet/get";
import { getTransactionsByUserId } from "@app/utils/db-actions/transaction";
import { parseDate, parseMoney, parseTime } from "@app/utils/parser";

export const metadata = {
  title: "gringott | transakcje",
};

export default async function TransactionsPage() {
  const user = await getUser();
  const wallets = await getWallets(user.id);
  const transactions = await getTransactionsByUserId(user.id);

  return (
    <div className="flex flex-col w-full h-full bg-surface rounded-tl-2xl shadow-sm">
      <div className="flex justify-center items-end gap-[20px] font-bold text-primary text-xl w-full h-[50px] pb-[5px]">
        <div className="flex justify-center items-center w-[200px]">DATA</div>
        <div className="flex justify-center items-center w-[160px]">KWOTA</div>
        <div className="flex justify-center items-center w-[200px]">OPIS</div>
        <div className="flex justify-center items-center w-[150px]">METODA</div>
        <div className="flex justify-center items-center w-[200px]">
          KATEGORIA
        </div>
        <div className="flex justify-center items-center w-[200px]">
          DRUGA STRONA
        </div>
        <div className="flex justify-center items-center w-[100px]">
          PORTFEL
        </div>
      </div>
      {transactions.sort((a, b) => b.date.getTime() - a.date.getTime()).map((transaction) => (
        <div className={`flex justify-center items-center gap-[20px] font-normal text-on-surface-variant text-md w-full h-[30px]`} key={transaction.id}>
          <div className="flex justify-center items-center gap-[6px] w-[200px]"><div>{parseDate(transaction.date)}</div><div className="text-[15px]">{parseTime(transaction.date)}</div></div>
          <div className={`flex justify-center items-center font-semibold w-[160px] ${transaction.income ? "text-green-800" : "text-red-800"}`}>{parseMoney(transaction.amount)} zł</div>
          <div className="flex justify-center items-center w-[200px]">{transaction.description}</div>
          <div className="flex justify-center items-center w-[150px]">{transaction.method}</div>
          <div className="flex justify-center items-center w-[200px]">
            {transaction.super_category}: {transaction.category}
          </div>
          <div className="flex justify-center items-center w-[200px]">{transaction.counterparty}</div>
          <div className="flex justify-center items-center w-[100px]">
            {wallets.filter((wallet) => wallet.id === transaction.wallet_id)[0]
              .name ?? "gotówka"}
          </div>
        </div>
      ))}
    </div>
  );
}
