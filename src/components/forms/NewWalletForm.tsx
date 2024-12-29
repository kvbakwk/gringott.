"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

import { createWallet } from "@app/api/wallet/create";
import {
  validateWalletBalance,
  validateWalletName,
} from "@app/utils/validator";
import { TextFieldOutlined } from "../material/TextField";
import { FilledButton } from "../material/Button";

export default function NewWalletForm({ user_id }) {
  const router = useRouter()

  const [nameErr, setNameErr] = useState(false);
  const [balanceErr, setBalanceErr] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState(false);

  const handleSubmit = async (
    e: React.FormEvent<HTMLFormElement>
  ): Promise<void> => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);

    if (
      validateWalletName(formData.get("name").toString()) &&
      validateWalletBalance(parseFloat(formData.get("balance").toString()))
    ) {
      try {
        const res = await createWallet(
          formData.get("name").toString(),
          parseFloat(formData.get("balance").toString()),
          user_id,
          2
        );
        setNameErr(res.nameErr);
        setBalanceErr(res.balanceErr);
        setSuccess(res.createWallet);
        setError(false);
        if(res.createWallet)
          router.back()
      } catch (err) {
        setNameErr(false);
        setBalanceErr(false);
        setSuccess(false);
        setError(true);
      }
    } else {
      setNameErr(!validateWalletName(formData.get("name").toString()));
      setBalanceErr(
        !validateWalletBalance(parseFloat(formData.get("balance").toString()))
      );
      setError(false);
      setSuccess(false);
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
      <div className="flex justify-end items-center w-[320px] pr-[10px]">
        <FilledButton>dodaj konto</FilledButton>
      </div>
    </form>
  );
}
