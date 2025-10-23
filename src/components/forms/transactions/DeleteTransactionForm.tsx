"use client";

import { TransactionT } from "@app/utils/db-actions/transaction";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";

import { getTransaction } from "@app/api/transaction/get";
import { deleteTransactionAPI } from "@app/api/transaction/delete";
import { FilledButton, OutlinedButton } from "../../material/Button";

export default function DeleteTransactionForm({
  userId,
  transaction,
  successOperation,
  cancelOperation,
}: {
  userId: number;
  transaction: TransactionT;
  successOperation: () => void;
  cancelOperation: () => void;
}) {
  const errorEl = useRef(null);

  const [error, setError] = useState<boolean>(false);

  useEffect(() => {
    if (error) {
      errorEl.current.classList.remove("hidden");
      errorEl.current.classList.add("flex");
    } else {
      errorEl.current.classList.remove("flex");
      errorEl.current.classList.add("hidden");
    }
  }, [error]);

  const handleSubmit = async (
    e: React.FormEvent<HTMLFormElement>
  ): Promise<void> => {
    e.preventDefault();

    deleteTransactionAPI(
      transaction.id,
      transaction.wallet_id,
      transaction.amount,
      transaction.income,
      userId
    )
      .then((res) =>
        res.createTransaction ? successOperation() : setError(true)
      )
      .catch(() => setError(true));
  };

  return (
    <form
      className="flex justify-center items-center gap-[30px] w-[500px] h-fit py-[40px] bg-surface border-1 border-error rounded-2xl shadow-lg transition-all"
      onSubmit={handleSubmit}>
      <div className="flex flex-col justify-center items-center gap-[50px] w-[400px] px-[10px] py-[10px]">
        <div className="font-medium text-[18px]">
          Czy na pewno chcesz usunąć tę transakcję?
        </div>
        <div className="flex justify-end items-center gap-[10px] w-full">
          <OutlinedButton type="button" onClick={() => cancelOperation()}>
            nie, anuluj
          </OutlinedButton>
          <FilledButton className="error" disabled={error}>
            tak, usuń
          </FilledButton>
        </div>
        <div
          ref={errorEl}
          className="hidden font-medium text-[14px] text-error">
          coś poszło nie tak.. spróbuj ponownie później
        </div>
      </div>
    </form>
  );
}
