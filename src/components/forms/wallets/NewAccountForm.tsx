"use client";

import { useState } from "react";
import { createWalletAPI } from "@services/wallet/create";
import {
  validateWalletBalance,
  validateWalletName,
} from "@utils/validator";

import { TextFieldOutlined } from "@components/material/TextField";
import { FilledButton, OutlinedButton } from "@components/material/Button";
import { Icon } from "@components/material/Icon";

export default function NewAccountForm({ 
  userId, 
  successOperation, 
  cancelOperation 
}: { 
  userId: number;
  successOperation: () => void;
  cancelOperation: () => void;
}) {
  const [pending, setPending] = useState<boolean>(false);
  const [nameErr, setNameErr] = useState<boolean>(false);
  const [balanceErr, setBalanceErr] = useState<boolean>(false);
  const [error, setError] = useState<boolean>(false);

  const handleSubmit = async (
    e: React.FormEvent<HTMLFormElement>
  ): Promise<void> => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);

    const name: string = formData.get("name").toString();
    const balance: number = parseFloat(formData.get("balance").toString());

    if (validateWalletName(name) && validateWalletBalance(balance)) {
      setPending(true);
      // Fixed to type 2 (Bank account)
      createWalletAPI(name, balance, userId, 2)
        .then((res) => {
          if (res.createWallet) {
              successOperation();
          } else {
              setNameErr(res.nameErr);
              setBalanceErr(res.balanceErr);
          }
        })
        .catch(() => setError(true))
        .finally(() => setPending(false));
    } else {
      setNameErr(!validateWalletName(name));
      setBalanceErr(!validateWalletBalance(balance));
    }
  };

  return (
    <form
      className="flex flex-col justify-center items-center gap-[30px] w-fit h-fit px-[90px] py-[60px] bg-surface border-1 border-primary rounded-2xl shadow-lg"
      onSubmit={handleSubmit}
    >
      <div className="flex flex-col gap-[25px] w-[320px]">
        <div className="flex justify-center items-center text-on-surface-variant font-bold uppercase text-xs tracking-widest mb-2">
            Nowe konto bankowe
        </div>
        
        <TextFieldOutlined
          className="w-full"
          label="nazwa konta"
          name="name"
          error={nameErr}
          errorText="od 1 do 20 znaków"
        >
            <Icon slot="leading-icon">account_balance</Icon>
        </TextFieldOutlined>

        <TextFieldOutlined
          className="w-full"
          label="saldo początkowe"
          name="balance"
          step="0.01"
          min="0"
          error={balanceErr}
          errorText="niepoprawna kwota"
          type="number"
          suffixText="zł"
        >
            <Icon slot="leading-icon">toll</Icon>
        </TextFieldOutlined>
      </div>

      <div className="flex justify-end items-center gap-[10px] w-full">
        <OutlinedButton type="button" onClick={cancelOperation}>
          anuluj
        </OutlinedButton>
        <FilledButton disabled={pending}>
            {pending ? "dodawanie..." : "dodaj konto"}
        </FilledButton>
      </div>
      
      {error && (
          <p className="text-error text-xs mt-2">Wystąpił nieoczekiwany błąd. Spróbuj ponownie.</p>
      )}
    </form>
  );
}
