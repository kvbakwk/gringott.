import { getUser } from "@app/api/user/get";
import { getBankWallets, getCashWallet } from "@app/api/wallet/get";
import { getTransactionsByUserId } from "@app/utils/db-actions/transaction";
import { parseDate, parseMoney } from "@app/utils/parser";

export const metadata = {
  title: "gringott | przychody",
};

export default async function Page() {
  const user = await getUser();
  const cashWallet = await getCashWallet(user.id);
  const bankWallets = await getBankWallets(user.id);
  const transactions = await getTransactionsByUserId(user.id);

  return (
    <>
      <table>
        <tr>
          <th>data</th>
          <th>kwota</th>
          <th>opis</th>
          <th>metoda</th>
          <th>kategoria</th>
        </tr>
        {transactions.filter(transaction => transaction.income).map((transaction) => (
          <tr key={transaction.id}>
            <td>
              {parseDate(transaction.date, false)}
            </td>
            <td>{parseMoney(transaction.amount)} zł</td>
            <td>{transaction.description}</td>
            <td>{transaction.method}</td>
            <td>{transaction.super_category}: {transaction.category}</td>
          </tr>
        ))}
      </table>
    </>
  );
}
