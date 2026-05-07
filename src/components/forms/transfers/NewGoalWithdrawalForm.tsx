"use client";

import { FormEvent, useState } from "react";

import { WalletT } from "@utils/db-actions/wallet";
import { MethodT } from "@utils/db-actions/method";
import { FormState } from "@utils/definitions";

import createTransferAPI from "@services/transfer/create";

import { FilledButton, OutlinedButton } from "@components/material/Button";
import { SelectOption, SelectOutlined } from "@components/material/Select";
import { TextFieldOutlined } from "@components/material/TextField";
import { Icon } from "@components/material/Icon";
import { parseMoney } from "@utils/parser";

export default function NewGoalWithdrawalForm({
  userId,
  wallets,
  methods,
  sourceWallet,
  successOperation,
  cancelOperation,
}: {
  userId: number;
  wallets: WalletT[];
  methods: MethodT[];
  sourceWallet: WalletT;
  successOperation: () => void;
  cancelOperation: () => void;
}) {
  const [state, setState] = useState<FormState>(null);
  const [pending, setPending] = useState<boolean>(false);
  const [toType, setToType] = useState<number>(null);

  const progress = sourceWallet.target_amount 
    ? Math.min((sourceWallet.balance / sourceWallet.target_amount) * 100, 100) 
    : 0;

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
      <div className="flex justify-center items-center text-on-surface-variant font-bold uppercase text-xs tracking-widest">
        Wypłata z celu: {sourceWallet.name}
      </div>
      
      <div className="flex justify-center items-center gap-[30px] w-fit h-fit">
        <div className="flex flex-col justify-center items-center gap-[25px] w-[230px]">
          <div className="flex justify-center items-center text-on-surface-variant font-bold uppercase text-xs tracking-widest">
            z celu..
          </div>
          <input type="hidden" name="fromWalletId" value={sourceWallet.id.toString()} />
          <div className="flex flex-col gap-3 p-4 bg-tertiary/10 rounded-xl border border-tertiary/30">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full flex items-center justify-center bg-tertiary/20 text-tertiary">
                <Icon className="text-xl">{sourceWallet.icon || "target"}</Icon>
              </div>
              <div>
                <div className="font-bold text-on-surface">{sourceWallet.name}</div>
                <div className="text-xs text-on-surface-variant">
                  {parseMoney(sourceWallet.balance)} / {parseMoney(sourceWallet.target_amount || 0)} PLN
                </div>
              </div>
            </div>
            {sourceWallet.target_amount && (
              <div className="w-full h-1.5 bg-tertiary/20 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-tertiary rounded-full"
                  style={{ width: `${progress}%` }}
                />
              </div>
            )}
          </div>
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
            disabled={toType === null}
          >
            <Icon className="fill" slot="leading-icon">
              tactic
            </Icon>
            {methods
              .filter((method) =>
                toType === 0
                  ? method.cash
                  : toType === 1
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
            cel wypłaty..
          </div>
          <SelectOutlined
            className="w-full"
            label="typ celu"
            onChange={(e) => setToType(parseInt(e.currentTarget.value))}
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
            name="toWalletId"
            error={state?.errors?.toWalletId ? true : false}
            errorText={state?.errors?.toWalletId ? state.errors.toWalletId[0] : ""}
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
            {toType === 3 && (
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
      </div>
      <div className="flex justify-end items-center gap-[10px] w-full">
        <OutlinedButton type="button" onClick={() => cancelOperation()}>
          anuluj
        </OutlinedButton>
        <FilledButton disabled={pending}>wypłać z celu</FilledButton>
      </div>
    </form>
  );
}
