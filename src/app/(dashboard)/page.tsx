import { getUser } from "@app/api/user/get";
import { getBankWallets, getCashWallet } from "@app/api/wallet/get";
import { isWallet } from "@app/api/wallet/is";
import { parseMoney } from "@app/utils/parser";

export const metadata = {
  title: "gringott | strona główna",
};

export default async function Page() {
  const user = await getUser();
  const cashWallet = await getCashWallet(user.id);
  const bankWallets = await getBankWallets(user.id);
  const bankBalance: number = bankWallets.reduce((a, b) => a + b.balance, 0);

  console.log(cashWallet, bankWallets)

  return (
    <>
      STAN
      <br />
      {parseMoney(+cashWallet.balance + +bankBalance)} zł
      <br />
      <br />
      gotówka: {parseMoney(cashWallet.balance)} zł
      <br />
      {((await isWallet(user.id, false)) && (
        <>
          konta: {parseMoney(bankBalance)} zł
          {bankWallets.map(bankWallet => (
            <div key={bankWallet.id}> - {bankWallet.name}: {parseMoney(bankWallet.balance)} zł</div>
          ))}
          <br />
        </>
      )) || (
        <>
          skonfiguruj swoje pierwsze konto bankowe
          <br />
        </>
      )}
    </>
  );
}
