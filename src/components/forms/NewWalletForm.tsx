"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

import { createWallet } from "@app/api/wallet/create";
import {
  validateWalletBalance,
  validateWalletName,
} from "@app/utils/validator";
import { TextFieldOutlined } from "../material/TextField";
import { FilledButton, OutlinedButton } from "../material/Button";

export default function NewWalletForm({ userId }: { userId: number }) {
  const router = useRouter();

  const [success, setSuccess] = useState<boolean>(false);
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
      createWallet(name, balance, userId, 2)
        .then((res) => {
          setSuccess(res.createWallet);
          setNameErr(res.nameErr);
          setBalanceErr(res.balanceErr);
          setError(false);
          if (res.createWallet) router.back();
        })
        .catch(() => setError(true));
    } else {
      setSuccess(false);
      setNameErr(!validateWalletName(name));
      setBalanceErr(!validateWalletBalance(balance));
      setError(false);
    }
  };

  return (
    <form
      className="flex flex-col justify-center items-center gap-[30px] w-[500px] h-fit py-[60px]"
      onSubmit={handleSubmit}
    >
      <div className="flex flex-col justify-center items-center gap-[25px] w-[320px] px-[10px] py-[10px]">
        <TextFieldOutlined
          className="w-full"
          label="nazwa konta"
          name="name"
          error={nameErr}
          errorText="nazwa konta musi posiadać od 1 do 20 znaków"
        />
        <TextFieldOutlined
          className="w-full"
          label="stan konta"
          name="balance"
          step="0.01"
          min="0"
          error={balanceErr}
          errorText="wprowadzona kwota jest niepoprawna"
          type="number"
          suffixText="zł"
        />
      </div>
      <div className="flex justify-end items-center gap-[10px] w-[320px] pr-[10px]">
        <OutlinedButton type="button" onClick={() => router.back()}>
          anuluj
        </OutlinedButton>
        <FilledButton>dodaj konto</FilledButton>
      </div>
    </form>
  );
}
