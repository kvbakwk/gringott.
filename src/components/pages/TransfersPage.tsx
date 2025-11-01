"use client";

import { WalletT } from "@app/utils/db-actions/wallet";
import { TransferT } from "@app/utils/db-actions/transfer";

import { use, useEffect, useRef, useState } from "react";

import { parseDate, parseMoney, parseTime } from "@app/utils/parser";
import { CircularProgress } from "@components/material/Progress";
import { Fab } from "@components/material/Fab";
import { Icon } from "@components/material/Icon";
import { IconButton } from "@components/material/IconButton";
import WalletsList from "@components/WalletsList";
import { MethodT } from "@app/utils/db-actions/method";
import { SubjectT } from "@app/utils/db-actions/subject";
import NewTradeForm from "@components/forms/trades/NewTradeForm";
import EditTradeForm from "@components/forms/trades/EditTradeForm";
import DeleteTradeForm from "@components/forms/trades/DeleteTradeForm";
import NewTransferForm from "@components/forms/transfers/NewTransferForm";
import EditTransferForm from "@components/forms/transfers/EditTransferForm";
import DeleteTransferForm from "@components/forms/transfers/DeleteTransferForm";

export default function TransfersPage({
  wallets,
  transfers,
  methods,
  subjects,
  walletsReady,
  transfersReady,
  methodsReady,
  subjectsReady,
  reloadWallets,
  reloadTransfers,
  userId,
}: {
  wallets: WalletT[];
  transfers: TransferT[];
  methods: MethodT[];
  subjects: SubjectT[];
  walletsReady: boolean;
  transfersReady: boolean;
  methodsReady: boolean;
  subjectsReady: boolean;
  reloadWallets: () => void;
  reloadTransfers: () => void;
  userId: number;
}) {
  const formEl = useRef(null);
  const newTransferEl = useRef(null);

  const [operation, setOperation] = useState<string>("");
  const [id, setId] = useState<number>(0);
  const [focusEl, setFocusEl] = useState<HTMLElement>(null);

  const successOperation = () => {
    hideForm();
    setOperation("");
    reloadWallets();
    reloadTransfers();
  };
  const cancelOperation = () => {
    hideForm();
    setOperation("");
  };

  useEffect(() => {
    if (["new", "edit", "delete"].includes(operation)) {
      formEl.current.classList.remove("hidden");
      formEl.current.classList.add("flex");
      setTimeout(() => {
        formEl.current.classList.remove("opacity-0");
      }, 1);
      if (focusEl) {
        focusEl.classList.add("transition-all");
        focusEl.classList.add("shadow-sm");
        focusEl.classList.add("bg-surface");
        focusEl.classList.add("border-1");
        focusEl.classList.remove("border-surface");
        operation === "new"
          ? focusEl.classList.add("border-green-700")
          : operation === "edit"
          ? focusEl.classList.add("border-yellow-500")
          : focusEl.classList.add("border-error");
      }
    }
  }, [operation]);

  const hideForm = () => {
    formEl.current.classList.remove("flex");
    formEl.current.classList.add("hidden");
    setTimeout(() => {
      formEl.current.classList.add("opacity-0");
    }, 1);
    if (focusEl) {
      if (operation === "new") {
        focusEl.classList.remove("shadow-sm");
        focusEl.classList.add("border-surface");
        focusEl.classList.remove("border-green-700");
        setTimeout(() => {
          focusEl.classList.remove("transition-all");
        }, 10);
      } else {
        focusEl.classList.remove("shadow-sm");
        focusEl.classList.remove("bg-surface");
        focusEl.classList.remove("border-1");
        focusEl.classList.remove("border-green-700");
        focusEl.classList.remove("border-yellow-500");
        focusEl.classList.remove("border-error");
        setTimeout(() => {
          focusEl.classList.remove("transition-all");
        }, 10);
      }
    }
  };

  return (
    <div className="relative grid grid-rows-[50px_1fr] w-full h-full">
      <div className="flex justify-between items-center w-full h-full px-[20px]">
        <div
          ref={newTransferEl}
          className="flex items-center gap-[18px] text-base text-primary w-[230px] h-[30px] p-[18px] rounded-2xl cursor-pointer bg-surface border-1 border-surface"
          onClick={() => {
            setOperation("new");
            setFocusEl(newTransferEl.current);
          }}
        >
          <Icon slot="icon">add</Icon>
          <div className="text-on-surface-variant">nowy transfer</div>
        </div>
        <WalletsList wallets={wallets} walletsReady={walletsReady} />
      </div>
      <div className="flex flex-col w-[calc(100%-50px)] h-full">
        <div className="flex justify-around items-end gap-[20px] font-bold text-primary text-md w-full h-[50px] px-[20px] pb-[10px]">
          <div className="flex w-[100px]"></div>
          <div className="flex justify-center items-center w-[200px]">data</div>
          <div className="flex justify-center items-center w-[160px]">
            kwota
          </div>
          <div className="flex justify-center items-center w-[200px]">
            z portfela..
          </div>
          <div className="flex justify-center items-center w-[200px]">
            do portfela..
          </div>
          <div className="flex justify-center items-center w-[200px]">
            metoda
          </div>
          <div className="flex w-[100px]"></div>
        </div>
        <div
          className={`flex w-full h-[calc(100vh-160px)] px-[20px] pb-[30px] overflow-y-auto scroll-none ${
            walletsReady && transfersReady && methodsReady && subjectsReady
              ? "flex-col"
              : "justify-center items-center"
          }`}
        >
          {walletsReady &&
            transfersReady &&
            methodsReady &&
            subjectsReady &&
            transfers
              .sort((a, b) => b.date.getTime() - a.date.getTime())
              .map((transfer) => (
                <Transfer
                  transfer={transfer}
                  wallets={wallets}
                  key={transfer.id}
                  setOperation={setOperation}
                  setId={setId}
                  setFocusEl={setFocusEl}
                />
              ))}
          <div
            className={`${
              walletsReady &&
              transfersReady &&
              methodsReady &&
              subjectsReady &&
              " hidden"
            }`}
          >
            <CircularProgress indeterminate />
          </div>
        </div>
      </div>
      <div
        ref={formEl}
        className="absolute hidden justify-center items-center w-full h-full opacity-0 transition-all"
      >
        {operation === "new" ? (
          <NewTransferForm
            userId={userId}
            wallets={wallets}
            methods={methods}
            walletsReady={walletsReady}
            methodsReady={methodsReady}
            successOperation={successOperation}
            cancelOperation={cancelOperation}
          />
        ) : operation === "edit" ? (
          <EditTransferForm
            userId={userId}
            wallets={wallets}
            transfer={transfers.find((transfer) => transfer.id === id)}
            methods={methods}
            walletsReady={walletsReady}
            methodsReady={methodsReady}
            successOperation={successOperation}
            cancelOperation={cancelOperation}
          />
        ) : operation === "delete" ? (
          <DeleteTransferForm
            userId={userId}
            transfer={transfers.find((transfer) => transfer.id === id)}
            successOperation={successOperation}
            cancelOperation={cancelOperation}
          />
        ) : (
          <></>
        )}
      </div>
    </div>
  );
}

export function Transfer({
  transfer,
  wallets,
  setOperation,
  setId,
  setFocusEl,
}: {
  transfer: TransferT;
  wallets: WalletT[];
  setOperation: (operation: string) => void;
  setId: (id: number) => void;
  setFocusEl: (focusEl: HTMLElement) => void;
}) {
  const tradeEl = useRef(null);
  const amountEl = useRef(null);

  const [hover, setHover] = useState(false);

  return (
    <div
      ref={tradeEl}
      className={`flex justify-around items-center gap-[20px] font-normal text-on-surface-variant text-base w-full h-[30px] rounded-lg hover:shadow-sm hover:bg-surface`}
      key={transfer.id}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
    >
      <div className="w-[100px] h-full"></div>
      <div className="flex justify-center items-center gap-[6px] w-[200px]">
        <div>{parseDate(transfer.date)}</div>
        <div className="text-[15px]">{parseTime(transfer.date)}</div>
      </div>
      <div
        ref={amountEl}
        className="flex justify-center items-center font-semibold text-lg w-[160px]"
      >
        {parseMoney(transfer.amount)} zł
      </div>
      <div className="flex justify-center items-center truncate w-[200px]">
        {
          wallets.filter(
            (wallet: WalletT) => wallet.id === transfer.from_wallet_id
          )[0].name
        }
      </div>
      <div className="flex justify-center items-center truncate w-[200px]">
        {
          wallets.filter(
            (wallet: WalletT) => wallet.id === transfer.to_wallet_id
          )[0].name
        }
      </div>
      <div className="flex justify-center items-center w-[200px]">
        {transfer.method.name}
      </div>
      <div
        className={`flex justify-center items-center w-[100px] h-full transition-opacity ${
          hover ? "opacity-100" : "opacity-0"
        }`}
      >
        <IconButton
          className="mini"
          onClick={() => {
            setOperation("edit");
            setId(transfer.id);
            setFocusEl(tradeEl.current);
          }}
        >
          <Icon>edit</Icon>
        </IconButton>
        <IconButton
          className="mini error"
          onClick={() => {
            setOperation("delete");
            setId(transfer.id);
            setFocusEl(tradeEl.current);
          }}
        >
          <Icon>delete</Icon>
        </IconButton>
      </div>
    </div>
  );
}
