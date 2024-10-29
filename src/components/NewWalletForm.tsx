"use client";

import {
  validateWalletBalance,
  validateWalletName,
} from "@app/utils/validator";
import { useState } from "react";
import { createWallet } from "@app/api/wallet/create";

export default function NewWalletForm({ user_id }) {
  const [nameErr, setNameErr] = useState(false);
  const [balanceErr, setBalanceErr] = useState(false);
  const [walletSuc, setWalletSuc] = useState(false);

  const handleSubmit = async (formData: FormData): Promise<void> => {
    console.log(formData.get("balance").toString());
    setNameErr(!validateWalletName(formData.get("name").toString()));
    setBalanceErr(!validateWalletBalance(formData.get("balance").toString()));
    if (
      validateWalletName(formData.get("name").toString()) &&
      validateWalletBalance(formData.get("balance").toString())
    ) {
      const res = await createWallet(
        formData.get("name").toString(),
        formData.get("balance").toString(),
        user_id
      );
      setWalletSuc(res.createWallet)
    }
  };

  return (
    <>
      <form action={handleSubmit}>
        <input type="text" name="name" id="name" placeholder="nazwa" />
        <br />
        {nameErr ? (
          <>
            <span>nazwa portfela musi mieć od 1 do 20 znaków</span>
            <br />
          </>
        ) : (
          <></>
        )}
        <input
          type="number"
          name="balance"
          id="balance"
          defaultValue="0"
          step="0.01"
          min="0"
          placeholder="stan konta"
        />{" "}
        zł
        <br />
        {balanceErr ? (
          <>
            <span>spróbuj wprowadzić dane jeszcze raz</span>
            <br />
          </>
        ) : (
          <></>
        )}
        <input type="submit" value="dodaj konto" />
      </form>
      {walletSuc ? (
          <>
            <div>Udało ci się utworzyć konto</div>
          </>
        ) : (
          <></>
        )}
    </>
  );
}
