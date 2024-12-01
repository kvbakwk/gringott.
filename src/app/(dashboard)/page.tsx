import { getUser } from "@app/api/user/get";
import { getWallets } from "@app/api/wallet/get";
import { parseMoney } from "@app/utils/parser";

export const metadata = {
  title: "gringott | strona główna",
};

export default async function Page() {
  const user = await getUser();
  const wallets = await getWallets(user.id);
  const cashBalance: number = wallets.filter((wallet) => wallet.cash)[0]
    .balance;
  const bankBalance: number = wallets
    .filter((wallet) => !wallet.cash)
    .reduce((a, b) => a + b.balance, 0);

  return (
    <>
      STAN
      <br />
      {parseMoney(+cashBalance + +bankBalance)} zł
      <br />
      <br />
      gotówka: {parseMoney(cashBalance)} zł
      <br />
      konta: {parseMoney(bankBalance)} zł
      {wallets.filter((wallet) => !wallet.cash).length &&
        wallets
          .filter((wallet) => !wallet.cash)
          .map((bankWallet) => (
            <div key={bankWallet.id}>
              - {bankWallet.name}: {parseMoney(bankWallet.balance)} zł
            </div>
          ))}
    </>
  );
}
