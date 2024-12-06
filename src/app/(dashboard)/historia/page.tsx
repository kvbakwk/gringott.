import { getUser } from "@app/api/user/get";
import { getWallets } from "@app/api/wallet/get";
import { getTransactionsByUserId } from "@app/utils/db-actions/transaction";
import { parseDate, parseMoney } from "@app/utils/parser";

export const metadata = {
  title: "gringott | transakcje",
};

export default async function HistoryPage() {
  const user = await getUser();
  const wallets = await getWallets(user.id);
  const transactions = await getTransactionsByUserId(user.id);
  const days = [];

  {
    let time = new Date();

    time.setHours(0);
    time.setMinutes(0);
    time.setSeconds(0);
    time.setMilliseconds(0);

    while (
      time.getTime() >=
      transactions
        .sort(
          (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
        )[0]
        .date.getTime() -
        86400000
    ) {
      days.push(new Date(time));
      time.setTime(time.getTime() - 86400000);
    }
  }

  console.log(transactions[0].date);

  return (
    <div className="flex flex-col w-full h-full bg-surface rounded-tl-2xl shadow-sm">
      <div className="flex justify-center items-end gap-[20px] font-bold text-primary text-xl w-full h-[50px] pb-[5px]">
        <div className="flex justify-center items-center w-[200px]">DATA</div>
        <div className="flex justify-center items-center w-[200px]">STAN</div>
        <div className="flex justify-center items-center w-[200px]">
          GOTÓWKA
        </div>
        <div className="flex justify-center items-center w-[200px]">KONTA</div>
        <div className="flex justify-center items-center w-[200px]">
          PRZYCHÓD
        </div>
        <div className="flex justify-center items-center w-[200px]">
          ROZCHÓD
        </div>
      </div>
      <div className="flex flex-col gap-[10px] w-full h-[calc(100vh-160px)] overflow-y-auto scroll-none">
        {days.map((day) => (
          <div
            className="flex justify-center items-center gap-[20px] font-normal text-on-surface-variant text-md w-full"
            key={day.getTime()}
          >
            <div className="flex justify-center items-center w-[200px]">
              {parseDate(day, false)}
            </div>
            <div className="flex justify-center items-center font-semibold w-[200px]">
              {parseMoney(transactions.filter(transaction => transaction.date.getTime() - 86399999 <= day.getTime()).reduce((a, b) => b.income ? a + b.amount : a - b.amount, 0))} zł
            </div>
            <div className="flex justify-center items-center w-[200px]">
              {parseMoney(transactions.filter(transaction => transaction.date.getTime() - 86399999 <= day.getTime() && wallets.filter(wallet => wallet.id === transaction.wallet_id)[0].cash).reduce((a, b) => b.income ? a + b.amount : a - b.amount, 0))} zł
            </div>
            <div className="flex justify-center items-center w-[200px]">
              {parseMoney(transactions.filter(transaction => transaction.date.getTime() - 86399999 <= day.getTime() && !wallets.filter(wallet => wallet.id === transaction.wallet_id)[0].cash).reduce((a, b) => b.income ? a + b.amount : a - b.amount, 0))} zł
            </div>
            <div className="flex justify-center items-center text-green-700 w-[200px]">
              {parseMoney(transactions.filter(transaction => transaction.date.getTime() >= day.getTime() && transaction.date.getTime() < day.getTime() + 86400000 && transaction.income).reduce((a, b) => b.income ? a + b.amount : a - b.amount, 0))} zł
            </div>
            <div className="flex justify-center items-center text-red-800 w-[200px]">
              {parseMoney(transactions.filter(transaction => transaction.date.getTime() >= day.getTime() && transaction.date.getTime() < day.getTime() + 86400000 && !transaction.income).reduce((a, b) => a + b.amount, 0))} zł
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
