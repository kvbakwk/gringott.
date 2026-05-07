"use client";

import { WalletT } from "@utils/db-actions/wallet";
import { useEffect, useRef, useState } from "react";
import { deleteWalletAPI } from "@services/wallet/delete";
import { FilledButton, OutlinedButton } from "../../material/Button";
import { Icon } from "@components/material/Icon";
import { parseMoney } from "@utils/parser";

export default function DeletePiggybankForm({
  wallet,
  successOperation,
  cancelOperation,
}: {
  wallet: WalletT;
  successOperation: () => void;
  cancelOperation: () => void;
}) {
  const errorEl = useRef<HTMLDivElement>(null);
  const [error, setError] = useState<boolean>(false);
  const [pending, setPending] = useState<boolean>(false);

  useEffect(() => {
    if (error) {
      errorEl.current?.classList.remove("hidden");
      errorEl.current?.classList.add("flex");
    } else {
      errorEl.current?.classList.remove("flex");
      errorEl.current?.classList.add("hidden");
    }
  }, [error]);

  const handleSubmit = async (
    e: React.FormEvent<HTMLFormElement>
  ): Promise<void> => {
    e.preventDefault();
    setPending(true);

    deleteWalletAPI(wallet.id)
      .then((res) =>
        res.success ? successOperation() : setError(true)
      )
      .catch(() => setError(true))
      .finally(() => setPending(false));
  };

  return (
    <form
      className="flex justify-center items-center gap-[30px] w-[500px] h-fit py-[40px] bg-surface border-1 border-error rounded-2xl shadow-lg transition-all"
      onSubmit={handleSubmit}
    >
      <div className="flex flex-col justify-center items-center gap-[30px] w-[400px] px-[10px] py-[10px]">
        
        {/* Icon and title */}
        <div className="flex flex-col items-center gap-4">
          <div className="w-16 h-16 rounded-full flex items-center justify-center bg-error/10 text-error">
            <Icon className="text-3xl">{wallet.icon || "savings"}</Icon>
          </div>
          <div className="font-medium text-[18px] text-center">
            Czy na pewno chcesz usunąć skarbonkę?
          </div>
        </div>

        {/* Wallet info */}
        <div className="flex items-center gap-4 p-4 bg-surface-variant/30 rounded-xl w-full">
          <div className="flex-1">
            <div className="font-bold text-on-surface">{wallet.name}</div>
            <div className="text-sm text-on-surface-variant">Saldo: {parseMoney(wallet.balance)} PLN</div>
          </div>
        </div>

        {/* Warning */}
        {wallet.balance > 0 && (
          <div className="flex items-center gap-2 text-sm text-warning bg-warning/10 p-3 rounded-lg w-full">
            <Icon className="text-lg text-amber-600">warning</Icon>
            <span className="text-amber-700">Ta skarbonka zawiera środki. Upewnij się, że je wypłaciłeś przed usunięciem.</span>
          </div>
        )}

        {/* Buttons */}
        <div className="flex justify-end items-center gap-[10px] w-full">
          <OutlinedButton type="button" onClick={() => cancelOperation()}>
            nie, anuluj
          </OutlinedButton>
          <FilledButton className="error" disabled={pending || error}>
            {pending ? "usuwanie..." : "tak, usuń"}
          </FilledButton>
        </div>

        {/* Error message */}
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
