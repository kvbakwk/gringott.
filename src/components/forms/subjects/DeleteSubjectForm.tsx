"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

import { deleteSubject } from "@app/api/subject/delete";
import { FilledButton, OutlinedButton } from "../../material/Button";

export default function DeleteSubjectForm({
  userId,
  subjectId,
}: {
  userId: number;
  subjectId: number;
}) {
  const router = useRouter();

  const [success, setSuccess] = useState<boolean>(false);
  const [transactionErr, setTransactionErr] = useState<boolean>(false);
  const [tradeErr, setTradeErr] = useState<boolean>(false);
  const [error, setError] = useState<boolean>(false);

  const handleSubmit = async (
    e: React.FormEvent<HTMLFormElement>
  ): Promise<void> => {
    e.preventDefault();

    deleteSubject(subjectId, userId)
      .then((res) => {
        setSuccess(res.success);
        setTransactionErr(res.transactionErr);
        setTradeErr(res.tradeErr);
        setError(false);
        if (res.success) router.back();
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
          czy na pewno chcesz usunąć ten podmiot?
        </div>
        <div className="flex flex-col gap-[10px] w-full">
          <div className="flex justify-end items-center gap-[10px] w-full">
            <OutlinedButton type="button" onClick={() => router.back()}>
              nie, anuluj
            </OutlinedButton>
            <FilledButton className="error" disabled={transactionErr}>
              tak, usuń
            </FilledButton>
          </div>
          {(transactionErr || tradeErr) && (
            <div className="font-medium text-error text-[12px] text-center">
              nie można usunąć tego podmiotu, dopóki jest on używany
            </div>
          )}
        </div>
      </div>
    </form>
  );
}
