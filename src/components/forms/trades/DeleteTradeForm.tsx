"use client";

import { TradeT } from "@app/utils/db-actions/trade";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

import { getTrade } from "@app/api/trade/get";
import { FilledButton, OutlinedButton } from "../../material/Button";

export default function DeleteTradeForm({
  userId,
  tradeId,
}: {
  userId: number;
  tradeId: number;
}) {
  const router = useRouter();

  const [trade, setTrade] = useState<TradeT>(null);

  const [success, setSuccess] = useState<boolean>(false);
  const [error, setError] = useState<boolean>(false);

  useEffect(() => {
    getTrade(tradeId).then((res) => {
      setTrade(res);
    });
  }, []);

  const handleSubmit = async (
    e: React.FormEvent<HTMLFormElement>
  ): Promise<void> => {
    e.preventDefault();
  };

  return (
    <form
      className="flex justify-center items-center gap-[30px] w-[500px] h-fit py-[60px]"
      onSubmit={handleSubmit}
    >
      <div className="flex flex-col justify-center items-center gap-[50px] w-[400px] px-[10px] py-[10px]">
        <div className="font-medium text-[18px]">
          Czy na pewno chcesz usunąć tę wymianę?
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
