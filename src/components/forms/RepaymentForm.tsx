"use client";

import { useState } from "react";

import { WalletT } from "@/types/wallet";
import { LoanT } from "@/types/loan";

import {
  validateTransactionAmount,
  validateTransactionWalletId,
} from "@utils/validator";

import { FilledButton, OutlinedButton } from "@components/material/Button";
import { TextFieldOutlined } from "@components/material/TextField";
import { Icon } from "@components/material/Icon";
import { SelectOption, SelectOutlined } from "@components/material/Select";

export default function RepaymentForm({
  loan,
  wallets,
  onSubmit,
  onCancel,
  userId,
}: {
  loan: LoanT;
  wallets: WalletT[];
  onSubmit: (data: any) => Promise<void>;
  onCancel: () => void;
  userId: number;
}) {
  const [amount, setAmount] = useState<string>("");
  const [walletId, setWalletId] = useState<string>("");
  const [loading, setLoading] = useState(false);

  const [walletIdErr, setWalletIdErr] = useState(false);
  const [amountErr, setAmountErr] = useState(false);

  const maxRepay = Number(loan.total_amount) - (loan as any).computedPaidAmount;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const numAmount = parseFloat(amount);
    const numWalletId = parseInt(walletId);

    const isWalletValid = await validateTransactionWalletId(
      numWalletId,
      userId,
    );
    const isAmountValid =
      validateTransactionAmount(numAmount) &&
      numAmount > 0 &&
      numAmount <= maxRepay;

    setWalletIdErr(!isWalletValid);
    setAmountErr(!isAmountValid);

    if (!isWalletValid || !isAmountValid) return;

    setLoading(true);
    try {
      await onSubmit({
        loanId: loan.id,
        amount: numAmount,
        walletId: numWalletId,
        description: `Spłata: ${loan.name || "pożyczka"}`,
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="flex flex-col gap-[25px] w-fit h-fit px-[60px] py-[40px] bg-surface border-1 border-blue-700 rounded-2xl shadow-lg min-w-[400px]"
    >
      <SelectOutlined
        label="portfel"
        value={walletId}
        // @ts-ignore
        onChange={(e) => {
          setWalletId((e.target as any).value);
          setWalletIdErr(false);
        }}
        className="w-full"
        error={walletIdErr}
        errorText="wybierz portfel"
      >
        <Icon slot="leading-icon">wallet</Icon>
        {wallets.map((w) => (
          <SelectOption key={w.id} value={w.id.toString()}>
            <div slot="headline">{w.name}</div>
          </SelectOption>
        ))}
      </SelectOutlined>

      <TextFieldOutlined
        label="kwota spłaty"
        type="number"
        value={amount}
        // @ts-ignore
        onChange={(e) => {
          setAmount((e.target as any).value);
          setAmountErr(false);
        }}
        max={maxRepay.toString()}
        suffixText="zł"
        error={amountErr}
        errorText={
          parseFloat(amount) > maxRepay
            ? "kwota większa niż należność"
            : "wpisz kwotę"
        }
      >
        <Icon slot="leading-icon">toll</Icon>
      </TextFieldOutlined>

      <div className="flex gap-[15px] justify-center mt-4">
        <OutlinedButton onClick={onCancel} type="button">
          anuluj
        </OutlinedButton>
        <FilledButton type="submit" disabled={loading}>
          zapisz
        </FilledButton>
      </div>
    </form>
  );
}
