"use client";

import { FormEvent, useState, useMemo } from "react";

import { WalletT } from "@utils/db-actions/wallet";
import { MethodT } from "@utils/db-actions/method";
import { FormState } from "@utils/definitions";

import createTransferAPI from "@services/transfer/create";

import { FilledButton, OutlinedButton } from "@components/material/Button";
import { SelectOption, SelectOutlined } from "@components/material/Select";
import { TextFieldOutlined } from "@components/material/TextField";
import { Icon } from "@components/material/Icon";

export default function NewPiggybankDepositForm({
  userId,
  wallets,
  methods,
  targetWallet,
  successOperation,
  cancelOperation,
}: {
  userId: number;
  wallets: WalletT[];
  methods: MethodT[];
  targetWallet: WalletT;
  successOperation: () => void;
  cancelOperation: () => void;
}) {
  const [state, setState] = useState<FormState>(null);
  const [pending, setPending] = useState<boolean>(false);
  const [fromType, setFromType] = useState<number>(null);

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    setPending(true);
    createTransferAPI(new FormData(e.currentTarget))
      .then((res) => (!res?.errors ? successOperation() : setState(res)))
      .finally(() => setPending(false));
  };

  return (
    <form
      className="flex flex-col justify-center items-center gap-[30px] w-fit h-fit px-[90px] py-[60px] bg-surface border-1 border-green-700 rounded-2xl shadow-lg"
      onSubmit={handleSubmit}
    >
      <div className="flex justify-center items-center text-on-surface-variant font-bold uppercase text-xs tracking-widest">
        Wpłata do skarbonki: {targetWallet.name}
      </div>
      
      <div className="flex justify-center items-center gap-[30px] w-fit h-fit">
        <div className="flex flex-col justify-center items-center gap-[25px] w-[230px]">
          <div className="flex justify-center items-center text-on-surface-variant font-bold uppercase text-xs tracking-widest">
            z portfela..
          </div>
          <SelectOutlined
            className="w-full"
            label="typ źródła"
            onChange={(e) => setFromType(parseInt(e.currentTarget.value))}
          >
            <Icon className="fill" slot="leading-icon">
              category
            </Icon>
            {[
              { name: "gotówka", id: 0 },
              { name: "konto", id: 1 },
              { name: "oszczędności", id: 3 },
            ].map((type) => (
              <SelectOption key={type.id} value={type.id.toString()}>
                <div slot="headline">{type.name}</div>
              </SelectOption>
            ))}
          </SelectOutlined>
          <SelectOutlined
            className="w-full"
            label="portfel"
            name="fromWalletId"
            error={state?.errors?.fromWalletId ? true : false}
            errorText={state?.errors?.fromWalletId ? state.errors.fromWalletId[0] : ""}
            disabled={fromType === null}
          >
            <Icon className="fill" slot="leading-icon">
              wallet
            </Icon>
            {fromType === 0 && (
              <SelectOption
                value={wallets
                  .filter((wallet) => wallet.wallet_type_id === 1)
                  .at(0)
                  ?.id.toString()}
              >
                <div slot="headline">gotówka</div>
              </SelectOption>
            )}
            {fromType === 1 &&
              wallets
                .filter((wallet) => wallet.wallet_type_id === 2)
                .map((wallet) => (
                  <SelectOption key={wallet.id} value={wallet.id.toString()}>
                    <div slot="headline">{wallet.name}</div>
                  </SelectOption>
                ))}
            {fromType === 3 && (
              <SelectOption
                value={wallets
                  .filter((wallet) => wallet.wallet_type_id === 3)
                  .at(0)
                  ?.id.toString()}
              >
                <div slot="headline">oszczędności</div>
              </SelectOption>
            )}
          </SelectOutlined>
        </div>
        <div className="flex flex-col gap-[25px] w-[250px]">
          <TextFieldOutlined
            className="w-full"
            label="kwota"
            name="amount"
            type="number"
            step="0.01"
            min="0"
            suffixText="zł"
            error={state?.errors?.amount ? true : false}
            errorText={state?.errors?.amount ? state.errors.amount[0] : ""}
          >
            <Icon slot="leading-icon">toll</Icon>
          </TextFieldOutlined>
          <SelectOutlined
            className="w-full"
            label="metoda"
            name="methodId"
            error={state?.errors?.methodId ? true : false}
            errorText={state?.errors?.methodId ? state.errors.methodId[0] : ""}
            disabled={fromType === null}
          >
            <Icon className="fill" slot="leading-icon">
              tactic
            </Icon>
            {methods
              .filter((method) =>
                fromType === 0
                  ? method.cash
                  : fromType === 1
                  ? method.bank
                  : method.cash || method.bank
              )
              .map((method) => (
                <SelectOption key={method.id} value={method.id.toString()}>
                  <div slot="headline">{method.name}</div>
                </SelectOption>
              ))}
          </SelectOutlined>
        </div>
        <div className="flex flex-col gap-[25px] w-[230px]">
          <div className="flex justify-center items-center text-on-surface-variant font-bold uppercase text-xs tracking-widest">
            do skarbonki..
          </div>
          <input type="hidden" name="toWalletId" value={targetWallet.id.toString()} />
          <div className="flex items-center gap-3 p-4 bg-tertiary/10 rounded-xl border border-tertiary/30">
            <div className="w-10 h-10 rounded-full flex items-center justify-center bg-tertiary/20 text-tertiary">
              <Icon className="text-xl">{targetWallet.icon || "savings"}</Icon>
            </div>
            <div>
              <div className="font-bold text-on-surface">{targetWallet.name}</div>
              <div className="text-xs text-on-surface-variant">Skarbonka</div>
            </div>
          </div>
        </div>
      </div>
      <div className="flex justify-end items-center gap-[10px] w-full">
        <OutlinedButton type="button" onClick={() => cancelOperation()}>
          anuluj
        </OutlinedButton>
        <FilledButton disabled={pending}>wpłać do skarbonki</FilledButton>
      </div>
    </form>
  );
}
