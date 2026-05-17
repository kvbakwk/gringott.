"use client";

import { WalletT } from "@/types/wallet";
import { useState } from "react";
import { deleteWalletAPI } from "@services/wallet/delete";
import { FilledButton, OutlinedButton } from "../../material/Button";

export default function DeleteAccountForm({
  wallet,
  successOperation,
  cancelOperation,
}: {
  wallet: WalletT;
  successOperation: () => void;
  cancelOperation: () => void;
}) {
  const [error, setError] = useState<boolean>(false);
  const [pending, setPending] = useState<boolean>(false);

  const handleSubmit = async (
    e: React.FormEvent<HTMLFormElement>,
  ): Promise<void> => {
    e.preventDefault();
    setPending(true);

    deleteWalletAPI(wallet.id)
      .then((res) => {
        if (res.success) {
          successOperation();
        } else {
          setError(true);
        }
      })
      .catch(() => setError(true))
      .finally(() => setPending(false));
  };

  return (
    <form
      className="flex justify-center items-center gap-[30px] w-fit h-fit px-[60px] py-[40px] bg-surface border-1 border-error rounded-2xl shadow-lg transition-all"
      onSubmit={handleSubmit}
    >
      <div className="flex flex-col justify-center items-center gap-[40px] w-[400px]">
        <div className="font-bold text-[20px] text-center text-on-surface">
          Czy na pewno chcesz usunąć to konto?
          <div className="text-sm font-normal text-on-surface-variant mt-2 italic">
            &quot;{wallet.name}&quot;
          </div>
        </div>

        {error && (
          <div className="text-error text-sm font-medium">
            Coś poszło nie tak.. spróbuj ponownie później
          </div>
        )}

        <div className="flex justify-center items-center gap-[15px] w-full">
          <OutlinedButton type="button" onClick={cancelOperation}>
            nie, anuluj
          </OutlinedButton>
          <FilledButton className="error" disabled={pending}>
            {pending ? "usuwanie..." : "tak, usuń"}
          </FilledButton>
        </div>
      </div>
    </form>
  );
}
