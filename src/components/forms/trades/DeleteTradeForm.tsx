"use client";

import { TradeT } from "@app/utils/db-actions/trade";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

import { getTrade } from "@app/api/trade/get";
import { FilledButton, OutlinedButton } from "../../material/Button";
import Loading from "@components/Loading";
import { deleteTradeAPI } from "@app/api/trade/delete";

export default function DeleteTradeForm({
  userId,
  tradeId,
}: {
  userId: number;
  tradeId: number;
}) {
  const router = useRouter();

  const [trade, setTrade] = useState<TradeT>(null);
  const [tradeReady, setTradeReady] = useState<boolean>(false);

  const [success, setSuccess] = useState<boolean>(false);
  const [tradeIdErr, setTradeIdErr] = useState<boolean>(false);
  const [error, setError] = useState<boolean>(false);

  useEffect(() => {
    getTrade(tradeId)
      .then((res) => {
        if (!res || res.user_id !== userId) setTradeIdErr(true);
        else setTrade(res);
      })
      .finally(() => setTradeReady(true));
  }, []);

  const handleSubmit = async (
    e: React.FormEvent<HTMLFormElement>
  ): Promise<void> => {
    e.preventDefault();

    if (trade && userId === trade.user_id)
      deleteTradeAPI(tradeId, userId).then((res) => {
        setSuccess(res.deleteTrade);
        setTradeIdErr(res.tradeIdErr);
        setError(false);
        if (res.deleteTrade) router.back();
      });
    else setTradeIdErr(userId !== trade.user_id);
  };
  if (tradeReady)
    return (
      <form
        className="flex justify-center items-center gap-[30px] w-[500px] h-fit py-[60px]"
        onSubmit={handleSubmit}
      >
        <div className="flex flex-col justify-center items-center gap-[50px] w-[400px] px-[10px] py-[10px]">
          <div className="font-medium text-[18px]">
            Czy na pewno chcesz usunąć tę wymianę?
          </div>
          <div className="flex flex-col gap-[10px] w-full">
            <div className="flex justify-end items-center gap-[10px] w-full">
              <OutlinedButton type="button" onClick={() => router.back()}>
                nie, anuluj
              </OutlinedButton>
              <FilledButton className="error" disabled={tradeIdErr}>tak, usuń</FilledButton>
            </div>
            {tradeIdErr && (
              <div className="font-medium text-error text-[12px] text-center">
                wymiana, którą próbujesz usunąć nie należy do Ciebie
              </div>
            )}
          </div>
        </div>
      </form>
    );
  else return <Loading />;
}
