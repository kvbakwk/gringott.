import getUser from "@app/api/user/get";
import { getBankWallets, getCashWallet } from "@app/api/wallet/get";

export const metadata = {
  title: "gringott | strona główna",
};

export default async function Page() {
  const user = await getUser();
  const cashWallet = await getCashWallet(user.id);
  const bankWallets = await getBankWallets(user.id);

  console.log(user, cashWallet, bankWallets);

  return (
    <>

    </>
  );
}
