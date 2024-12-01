import { getUser } from "@app/api/user/get";
import { getWallets } from "@app/api/wallet/get";
import { getTransactionsByUserId } from "@app/utils/db-actions/transaction";
import { parseDate, parseMoney } from "@app/utils/parser";

export const metadata = {
  title: "gringott | historia",
};

export default async function Page() {
  const user = await getUser();
  const wallets = await getWallets(user.id);
  const transactions = await getTransactionsByUserId(user.id);

  return (
    <>
      <table>
        <thead>
          <tr>
            <th>data</th>
            <th>kwota</th>
            <th>opis</th>
            <th>metoda</th>
            <th>kategoria</th>
            <th>nadawca/odbiorca</th>
            <th>portfel</th>
          </tr>
        </thead>
        <tbody>
          {transactions.map((transaction) => (
            <tr key={transaction.id}>
              <td>{parseDate(transaction.date, false)}</td>
              <td>{parseMoney(transaction.amount)} zł</td>
              <td>{transaction.description}</td>
              <td>{transaction.method}</td>
              <td>
                {transaction.super_category}: {transaction.category}
              </td>
              <td>{transaction.across_person}</td>
              <td>{wallets.filter(wallet => wallet.id === transaction.wallet_id)[0].name ?? "gotówka"}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </>
  );
}
