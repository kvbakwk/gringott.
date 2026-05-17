"use client";

import { FormEvent, useState, useMemo } from "react";

import { WalletT } from "@/types/wallet";
import { MethodT } from "@/types/method";
import { FormState } from "@utils/definitions";

import createTransferAPI from "@services/transfer/create";

import { FilledButton, OutlinedButton } from "@components/material/Button";
import { SelectOption, SelectOutlined } from "@components/material/Select";
import { TextFieldOutlined } from "@components/material/TextField";
import { Icon } from "@components/material/Icon";

export default function NewWithdrawalForm({
  userId,
  wallets,
  methods,
  successOperation,
  cancelOperation,
}: {
  userId: number;
  wallets: WalletT[];
  methods: MethodT[];
  successOperation: () => void;
  cancelOperation: () => void;
}) {
  const [state, setState] = useState<FormState>(null);
  const [pending, setPending] = useState<boolean>(false);

  // Default source to 3 (Savings)
  const [fromType, setFromType] = useState<number>(3);
  const [toType, setToType] = useState<number>(null);

  const savingsWallet = useMemo(
    () => wallets.find((w) => w.wallet_type_id === 3),
    [wallets],
  );
  const [fromWalletId, setFromWalletId] = useState<string>(
    savingsWallet?.id.toString() || "",
  );

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    setPending(true);
    createTransferAPI(new FormData(e.currentTarget))
      .then((res) => (!res?.errors ? successOperation() : setState(res)))
      .finally(() => setPending(false));
  };

  return (
    <form
      className="flex flex-col justify-center items-center gap-[30px] w-fit h-fit px-[90px] py-[60px] bg-surface border-1 border-red-700 rounded-2xl shadow-lg"
      onSubmit={handleSubmit}
    >
      <div className="flex justify-center items-center gap-[30px] w-fit h-fit">
        <div className="flex flex-col justify-center items-center gap-[25px] w-[230px]">
          <div className="flex justify-center items-center text-on-surface-variant font-bold uppercase text-xs tracking-widest">
            z oszczędności..
          </div>
          <input type="hidden" name="fromWalletId" value={fromWalletId} />
          <SelectOutlined
            className="w-full"
            label="portfel"
            value={fromWalletId}
            error={state?.errors?.fromWalletId ? true : false}
            errorText={
              state?.errors?.fromWalletId ? state.errors.fromWalletId[0] : ""
            }
            disabled={true}
          >
            <Icon className="fill" slot="leading-icon">
              wallet
            </Icon>
            {fromType === 3 && savingsWallet && (
              <SelectOption value={savingsWallet.id.toString()}>
                <div slot="headline">oszczędności</div>
              </SelectOption>
            )}
          </SelectOutlined>
          <SelectOutlined
            className="w-full"
            label="typ"
            value={fromType.toString()}
            disabled={true}
          >
            <Icon className="fill" slot="leading-icon">
              category
            </Icon>
            <SelectOption value="3">
              <div slot="headline">oszczędności</div>
            </SelectOption>
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
            disabled={fromType === null || toType === null}
          >
            <Icon className="fill" slot="leading-icon">
              tactic
            </Icon>
            {methods
              .filter((method) =>
                fromType === 0 || toType === 0
                  ? method.cash
                  : fromType === 1 || toType === 1
                    ? method.bank
                    : method.cash || method.bank,
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
            cel wypłaty..
          </div>
          <SelectOutlined
            className="w-full"
            label="portfel"
            name="toWalletId"
            error={state?.errors?.toWalletId ? true : false}
            errorText={
              state?.errors?.toWalletId ? state.errors.toWalletId[0] : ""
            }
            disabled={toType === null}
          >
            <Icon className="fill" slot="leading-icon">
              wallet
            </Icon>
            {toType === 0 && (
              <SelectOption
                value={wallets
                  .filter((wallet) => wallet.wallet_type_id === 1)
                  .at(0)
                  ?.id.toString()}
              >
                <div slot="headline">gotówka</div>
              </SelectOption>
            )}
            {toType === 1 &&
              wallets
                .filter((wallet) => wallet.wallet_type_id === 2)
                .map((wallet) => (
                  <SelectOption key={wallet.id} value={wallet.id.toString()}>
                    <div slot="headline">{wallet.name}</div>
                  </SelectOption>
                ))}
          </SelectOutlined>
          <SelectOutlined
            className="w-full"
            label="typ"
            onChange={(e) => setToType(parseInt(e.currentTarget.value))}
          >
            <Icon className="fill" slot="leading-icon">
              category
            </Icon>
            {[
              { name: "gotówka", id: 0 },
              { name: "konto", id: 1 },
            ].map((type) => (
              <SelectOption key={type.id} value={type.id.toString()}>
                <div slot="headline">{type.name}</div>
              </SelectOption>
            ))}
          </SelectOutlined>
        </div>
      </div>
      <div className="flex justify-end items-center gap-[10px] w-full">
        <OutlinedButton type="button" onClick={() => cancelOperation()}>
          anuluj
        </OutlinedButton>
        <FilledButton disabled={pending}>wypłać środki</FilledButton>
      </div>
    </form>
  );
}
