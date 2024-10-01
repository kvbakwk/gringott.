import getUser from "@app/api/user/get";
import { getBankWallets, getCashWallet } from "@app/api/wallet/get";
import { isUserHaveWallet } from "@app/api/wallet/is";

export const metadata = {
  title: "gringott | strona główna",
};

export default async function Page() {
  const user = await getUser();
  const cashWallet = await getCashWallet(user.id);
  const bankWallets = await getBankWallets(user.id);
  const bankBalance = bankWallets
    .reduce((a, b) => parseFloat(a.balance) + parseFloat(b.balance))
    .toFixed(2);

  return (
    <>
      {((await isUserHaveWallet(user.id, true)) && (
        <>
          gotówka: {cashWallet.balance} zł
          <br />
        </>
      )) || (
        <>
          skonfiguruj swój pierwszy portfel
          <br />
        </>
      )}
      {((await isUserHaveWallet(user.id, false)) && (
        <>
          konta: {bankBalance} zł
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
