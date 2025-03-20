"use client";


import { useState } from "react";
import { useRouter } from "next/navigation";

import { deleteCounterparty } from "@app/api/counterparty/delete";
import { FilledButton, OutlinedButton } from "../material/Button";

export default function DeleteCounterpartyForm({
  userId,
  counterpartyId,
}: {
  userId: number;
  counterpartyId: number;
}) {
  const router = useRouter();

  const [success, setSuccess] = useState<boolean>(false);
  const [error, setError] = useState<boolean>(false);

  const handleSubmit = async (
    e: React.FormEvent<HTMLFormElement>
  ): Promise<void> => {
    e.preventDefault();

    deleteCounterparty(counterpartyId, userId)
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
          Czy na pewno chcesz usunąć ten podmiot?
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
