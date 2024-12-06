import { getUser } from "@app/api/user/get";
import { getWallets } from "@app/api/wallet/get";
import { getTransactionsByUserId } from "@app/utils/db-actions/transaction";
import { parseMoney } from "@app/utils/parser";

export const metadata = {
  title: "gringott | strona główna",
};

export default async function Page() {
  const user = await getUser();
  const wallets = await getWallets(user.id);
  const transactions = await getTransactionsByUserId(user.id);

  const cashBalance: number = wallets.filter(
    (wallet) => wallet.wallet_type_id === 1
  )[0].balance;
  const bankBalance: number = wallets
    .filter((wallet) => wallet.wallet_type_id === 2)
    .reduce((a, b) => a + b.balance, 0);
  const savingsBalance: number = wallets.filter(
    (wallet) => wallet.wallet_type_id === 3
  )[0].balance;
  const investmentsBalance: number = wallets.filter(
    (wallet) => wallet.wallet_type_id === 4
  )[0].balance;

  function getWeekStartEnd() {
    const today = new Date();
    const day = today.getDay();
    const diff = today.getDate() - day + (day === 0 ? -6 : 1); // Adjust for Sunday
    const startOfWeek = new Date(today.setDate(diff));
    const endOfWeek = new Date(startOfWeek);
    endOfWeek.setDate(endOfWeek.getDate() + 6);
    return { startOfWeek, endOfWeek };
  }
  function getMonthStartEnd() {
    const today = new Date();
    const year = today.getFullYear();
    const month = today.getMonth();
    const startOfMonth = new Date(year, month, 1);
    const endOfMonth = new Date(year, month + 1, 0);
    return { startOfMonth, endOfMonth };
  }
  function getYearStartEnd() {
    const today = new Date();
    const year = today.getFullYear();
    const startOfYear = new Date(year, 0, 1);
    const endOfYear = new Date(year + 1, 0, 0);
    return { startOfYear, endOfYear };
  }

  const { startOfWeek, endOfWeek } = getWeekStartEnd();
  const { startOfMonth, endOfMonth } = getMonthStartEnd();
  const { startOfYear, endOfYear } = getYearStartEnd();

  return (
    <div className="grid grid-cols-12 grid-rows-12 justify-center items-center w-full h-full bg-surface rounded-tl-2xl shadow-sm">
      <div className="justify-self-center self-end col-start-3 row-start-2 col-span-2 font-bold text-primary">
        STAN
      </div>
      <div className="justify-self-center self-start col-start-3 row-start-3 col-span-2 font-bold text-4xl">
        {parseMoney(+cashBalance + +bankBalance)} zł
      </div>
      <div className="justify-self-end self-center col-start-2 row-start-4 font-bold text-primary">
        gotówka
      </div>
      <div className="justify-self-center self-center col-start-3 row-start-4 col-span-2 font-bold text-2xl">
        {parseMoney(cashBalance)} zł
      </div>
      <div className="justify-self-end self-center col-start-2 row-start-5 font-bold text-primary">
        konta
      </div>
      <div className="justify-self-center self-center col-start-3 row-start-5 col-span-2 font-bold text-2xl">
        {parseMoney(bankBalance)} zł
      </div>
      <div className="justify-self-end self-center col-start-2 row-start-6 font-bold text-primary">
        oszczędności
      </div>
      <div className="justify-self-center self-center col-start-3 row-start-7 col-span-2 font-bold text-2xl">
        {parseMoney(savingsBalance)} zł
      </div>
      <div className="justify-self-end self-center col-start-2 row-start-7 font-bold text-primary">
        inwestycje
      </div>
      <div className="justify-self-center self-center col-start-3 row-start-6 col-span-2 font-bold text-2xl">
        {parseMoney(investmentsBalance)} zł
      </div>

      <div className="justify-self-center self-end col-start-7 row-start-3 col-span-2 font-bold text-primary">
        PRZYCHÓD
      </div>
      <div className="justify-self-center self-center col-start-7 row-start-4 col-span-2 font-bold text-green-700 text-2xl">
        {parseMoney(
          transactions
            .filter(
              (transaction) =>
                transaction.date >= startOfWeek &&
                transaction.date < endOfWeek &&
                transaction.income
            )
            .reduce((a, b) => a + b.amount, 0)
        )}{" "}
        zł
      </div>
      <div className="justify-self-center self-center col-start-7 row-start-5 col-span-2 font-bold text-green-700 text-2xl">
        {parseMoney(
          transactions
            .filter(
              (transaction) =>
                transaction.date >= startOfMonth &&
                transaction.date < endOfMonth &&
                transaction.income
            )
            .reduce((a, b) => a + b.amount, 0)
        )}{" "}
        zł
      </div>
      <div className="justify-self-center self-center col-start-7 row-start-6 col-span-2 font-bold text-green-700 text-2xl">
        {parseMoney(
          transactions
            .filter(
              (transaction) =>
                transaction.date >= startOfYear &&
                transaction.date < endOfYear &&
                transaction.income
            )
            .reduce((a, b) => a + b.amount, 0)
        )}{" "}
        zł
      </div>
      <div className="justify-self-center self-center col-start-7 row-start-7 col-span-2 font-bold text-green-700 text-2xl">
        {parseMoney(
          transactions
            .filter((transaction) => transaction.income)
            .reduce((a, b) => a + b.amount, 0)
        )}{" "}
        zł
      </div>
      <div className="justify-self-center self-end col-start-9 row-start-3 col-span-2 font-bold text-primary">
        ROZCHÓD
      </div>
      <div className="justify-self-center self-center col-start-9 row-start-4 col-span-2 font-bold text-red-800 text-2xl">
        {parseMoney(
          transactions
            .filter(
              (transaction) =>
                transaction.date >= startOfWeek &&
                transaction.date < endOfWeek &&
                !transaction.income
            )
            .reduce((a, b) => a + b.amount, 0)
        )}{" "}
        zł
      </div>
      <div className="justify-self-center self-center col-start-9 row-start-5 col-span-2 font-bold text-red-800 text-2xl">
        {parseMoney(
          transactions
            .filter(
              (transaction) =>
                transaction.date >= startOfMonth &&
                transaction.date < endOfMonth &&
                !transaction.income
            )
            .reduce((a, b) => a + b.amount, 0)
        )}{" "}
        zł
      </div>
      <div className="justify-self-center self-center col-start-9 row-start-6 col-span-2 font-bold text-red-800 text-2xl">
        {parseMoney(
          transactions
            .filter(
              (transaction) =>
                transaction.date >= startOfYear &&
                transaction.date < endOfYear &&
                !transaction.income
            )
            .reduce((a, b) => a + b.amount, 0)
        )}{" "}
        zł
      </div>
      <div className="justify-self-center self-center col-start-9 row-start-7 col-span-2 font-bold text-red-800 text-2xl">
        {parseMoney(
          transactions
            .filter((transaction) => !transaction.income)
            .reduce((a, b) => a + b.amount, 0)
        )}{" "}
        zł
      </div>

      <div className="justify-self-start self-center col-start-11 row-start-4 font-bold text-primary">
        tydzień
      </div>
      <div className="justify-self-start self-center col-start-11 row-start-5 font-bold text-primary">
        miesiąc
      </div>
      <div className="justify-self-start self-center col-start-11 row-start-6 font-bold text-primary">
        rok
      </div>
      <div className="justify-self-start self-center col-start-11 row-start-7 font-bold text-primary">
        całość
      </div>
    </div>
  );
}
