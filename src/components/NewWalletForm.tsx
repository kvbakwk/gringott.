"use client";

import { createBankWallet } from "@app/api/wallet/create";
import {
  validateWalletBalance,
  validateWalletName,
} from "@app/utils/validator";
import { useState } from "react";

export default function NewWalletForm({ user_id }) {
  const [nameErr, setNameErr] = useState(false);
  const [balanceErr, setBalanceErr] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState(false);

  const handleSubmit = async (formData: FormData): Promise<void> => {
    if (
      validateWalletName(formData.get("name").toString()) &&
      validateWalletBalance(parseFloat(formData.get("balance").toString()))
    ) {
      try {
        const res = await createBankWallet(
          formData.get("name").toString(),
          parseFloat(formData.get("balance").toString()),
          user_id
        );
        setNameErr(res.nameErr);
        setBalanceErr(res.balanceErr);
        setSuccess(res.createWallet);
        setError(false);
      } catch (err) {
        setNameErr(false);
        setBalanceErr(false);
        setSuccess(false);
        setError(true);
      }
    } else {
      setNameErr(!validateWalletName(formData.get("name").toString()));
      setBalanceErr(!validateWalletBalance(parseFloat(formData.get("balance").toString())));
      setError(false);
      setSuccess(false);
    }
  };

  return (
    <>
      <form action={handleSubmit}>
        <input type="text" name="name" id="name" placeholder="nazwa" />
        <br />
        {nameErr && (
          <>
            <span>nazwa portfela musi mieć od 1 do 20 znaków</span>
            <br />
          </>
        )}
        <input
          type="number"
          name="balance"
          id="balance"
          step="0.01"
          min="0"
          placeholder="stan konta"
        />{" "}
        zł
        <br />
        {balanceErr && (
          <>
            <span>spróbuj wprowadzić dane jeszcze raz</span>
            <br />
          </>
        )}
        <input type="submit" value="dodaj konto" />
        <br />
        <br />
        {success && <div>udało ci się utworzyć konto</div>}
        {error && (
          <div>
            niestety nie udało się utworzyć konta, spróbuj ponownie później
          </div>
        )}
      </form>
    </>
  );
}
