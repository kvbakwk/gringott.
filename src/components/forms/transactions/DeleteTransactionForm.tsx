"use client";

import { TransactionT } from "@app/utils/db-actions/transaction";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

import { getTransaction } from "@app/api/transaction/get";
import { deleteTransactionAPI } from "@app/api/transaction/delete";
import { FilledButton, OutlinedButton } from "../../material/Button";

export default function DeleteTransactionForm({
  userId,
  transactionId,
}: {
  userId: number;
  transactionId: number;
}) {
  const router = useRouter();

  const [transaction, setTransaction] = useState<TransactionT>(null);

  const [success, setSuccess] = useState<boolean>(false);
  const [error, setError] = useState<boolean>(false);

  useEffect(() => {
    getTransaction(transactionId).then((res) => {
      setTransaction(res);
    });
  }, []);

  const handleSubmit = async (
    e: React.FormEvent<HTMLFormElement>
  ): Promise<void> => {
    e.preventDefault();

    const walletId: number = transaction.wallet_id;
    const income: boolean = transaction.income;
    const amount: number = transaction.amount;

    deleteTransactionAPI(transactionId, walletId, amount, income, userId)
      .then((res) => {
        setSuccess(res.createTransaction);
        setError(false);
        if (res.createTransaction) router.back();
      })
      .catch(() => setError(true));
  };

  return (
    <form
      className="flex justify-center items-center gap-[30px] w-[500px] h-fit py-[60px]"
      onSubmit={handleSubmit}
    >
      <div className="flex flex-col justify-center items-center gap-[50px] w-[400px] px-[10px] py-[10px]">
        <div className="font-medium text-[18px]">
          Czy na pewno chcesz usunąć tę transakcję?
        </div>
        <div className="flex justify-end items-center gap-[10px] w-full">
          <OutlinedButton type="button" onClick={() => router.back()}>
            nie, anuluj
          </OutlinedButton>
          <FilledButton className="error">tak, usuń</FilledButton>
        </div>
      </div>
    </form>
  );
}
