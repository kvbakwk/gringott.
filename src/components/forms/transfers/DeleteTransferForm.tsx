"use client";

import { TradeT } from "@app/utils/db-actions/trade";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";

import { getTrade } from "@app/api/trade/get";
import { FilledButton, OutlinedButton } from "../../material/Button";
import Loading from "@components/Loading";
import { deleteTradeAPI } from "@app/api/trade/delete";
import { TransferT } from "@app/utils/db-actions/transfer";
import deleteTransferAPI from "@app/api/transfer/delete";
import { FormState } from "@app/utils/definitions";

export default function DeleteTransferForm({
  userId,
  transfer,
  successOperation,
  cancelOperation,
}: {
  userId: number;
  transfer: TransferT;
  successOperation: () => void;
  cancelOperation: () => void;
}) {
  const errorEl = useRef(null);

  const [pending, setPending] = useState<boolean>(false);

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

    setPending(true);
    deleteTransferAPI(transfer.id)
      .then(() => successOperation())
      .catch(() => setError(true))
      .finally(() => setPending(false));
  };

  return (
    <form
      className="flex justify-center items-center gap-[30px] w-[500px] h-fit py-[40px] bg-surface border-1 border-error rounded-2xl shadow-lg transition-all"
      onSubmit={handleSubmit}
    >
      <div className="flex flex-col justify-center items-center gap-[50px] w-[400px] px-[10px] py-[10px]">
        <div className="font-medium text-[18px]">
          Czy na pewno chcesz usunąć ten transfer?
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
          className="hidden font-medium text-[14px] text-error"
        >
          coś poszło nie tak.. spróbuj ponownie później
        </div>
      </div>
    </form>
  );
}
