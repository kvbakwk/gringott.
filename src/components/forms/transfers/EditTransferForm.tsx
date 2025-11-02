"use client";

import { WalletT } from "@app/utils/db-actions/wallet";
import { MethodT } from "@app/utils/db-actions/method";
import { TransferT } from "@app/utils/db-actions/transfer";

import { FormEvent, useState } from "react";

import editTransferAPI from "@app/api/transfer/edit";

import { FilledButton, OutlinedButton } from "@components/material/Button";
import { SelectOption, SelectOutlined } from "@components/material/Select";
import { TextFieldOutlined } from "@components/material/TextField";
import { Icon } from "@components/material/Icon";
import { FormState } from "@app/utils/definitions";

export default function EditTransferForm({
  userId,
  wallets,
  transfer,
  methods,
  successOperation,
  cancelOperation,
}: {
  userId: number;
  wallets: WalletT[];
  transfer: TransferT;
  methods: MethodT[];
  successOperation: () => void;
  cancelOperation: () => void;
}) {
  const [state, setState] = useState<FormState>(null);
  const [pending, setPending] = useState<boolean>(false);

  const [amount, setAmount] = useState<number>(transfer.amount);
  const [fromWallet, setFromWallet] = useState<WalletT>(
    wallets.find((w) => w.id === transfer.from_wallet_id)
  );
  const [toWallet, setToWallet] = useState<WalletT>(
    wallets.find((w) => w.id === transfer.to_wallet_id)
  );
  const [method, setMethod] = useState<MethodT>(
    methods.find((m) => m.id === transfer.method.id)
  );
  const [fromType, setFromType] = useState<number>(
    fromWallet.wallet_type_id - 1
  );
  const [toType, setToType] = useState<number>(toWallet.wallet_type_id - 1);

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    setPending(true);
    editTransferAPI(transfer.id, new FormData(e.currentTarget), transfer.date)
      .then((res) => (!res?.errors ? successOperation() : setState(res)))
      .finally(() => setPending(false));
  };

  return (
    <form
      className="flex flex-col justify-center items-center gap-[30px] w-fit h-fit px-[90px] py-[60px] bg-surface border-1 border-green-700 rounded-2xl shadow-lg"
      onSubmit={handleSubmit}
    >
      <div className="flex justify-center items-center gap-[30px] w-fit h-fit">
        <div className="flex flex-col justify-center items-center gap-[25px] w-[230px]">
          <div className="flex justify-center items-center text-on-surface-variant">
            z portfela..
          </div>
          <SelectOutlined
            className="w-full"
            label="portfel"
            name="fromWalletId"
            onChange={(e) =>
              setFromWallet(
                wallets.find(
                  (wallet) => wallet.id === parseInt(e.currentTarget.value)
                )
              )
            }
            error={state?.errors?.fromWalletId ? true : false}
            errorText={state?.errors?.fromWalletId[0] ?? ""}
            disabled={fromType === null}
            value={fromWallet.id.toString()}
          >
            <Icon className="fill" slot="leading-icon">
              wallet
            </Icon>
            {fromType === 0 && toType !== 0 && (
              <SelectOption
                value={wallets
                  .filter((wallet) => wallet.wallet_type_id === 1)
                  .at(0)
                  .id.toString()}
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
            {fromType === 2 &&
              wallets
                .filter((wallet) => wallet.wallet_type_id > 5)
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
                  .id.toString()}
              >
                <div slot="headline">oszczędności</div>
              </SelectOption>
            )}
            {fromType === 4 &&
              wallets
                .filter((wallet) => wallet.wallet_type_id === 4)
                .map((wallet) => (
                  <SelectOption key={wallet.id} value={wallet.id.toString()}>
                    <div slot="headline">{wallet.name}</div>
                  </SelectOption>
                ))}
            {fromType === 5 &&
              wallets
                .filter((wallet) => wallet.wallet_type_id === 5)
                .map((wallet) => (
                  <SelectOption key={wallet.id} value={wallet.id.toString()}>
                    <div slot="headline">{wallet.name}</div>
                  </SelectOption>
                ))}
          </SelectOutlined>
          <SelectOutlined
            className="w-full"
            label="typ"
            onChange={(e) => setFromType(parseInt(e.currentTarget.value))}
            value={fromType.toString()}
          >
            <Icon className="fill" slot="leading-icon">
              category
            </Icon>
            {[
              { name: "gotówka", id: 0 },
              { name: "konto", id: 1 },
              { name: "inwestycje", id: 2 },
              { name: "oszczędności", id: 3 },
              { name: "skarbonka", id: 4 },
              { name: "cel", id: 5 },
            ]
              .filter(
                (type) =>
                  (toType === 0 && type.id !== 1) ||
                  (toType === 1 && type.id !== 0) ||
                  ![0, 1].includes(toType)
              )
              .map((type) => (
                <SelectOption key={type.id} value={type.id.toString()}>
                  <div slot="headline">{type.name}</div>
                </SelectOption>
              ))}
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
            onChange={(e) => setAmount(parseFloat(e.currentTarget.value))}
            error={state?.errors?.amount ? true : false}
            errorText={state?.errors?.amount[0] ?? ""}
            value={amount.toString()}
          >
            <Icon slot="leading-icon">toll</Icon>
          </TextFieldOutlined>
          <SelectOutlined
            className="w-full"
            label="metoda"
            name="methodId"
            onChange={(e) =>
              setMethod(
                methods.find(
                  (method) => method.id === parseInt(e.currentTarget.value)
                )
              )
            }
            error={state?.errors?.methodId ? true : false}
            errorText={state?.errors?.methodId[0] ?? ""}
            disabled={fromType === null || toType === null}
            value={method.id.toString()}
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
          <div className="flex justify-center items-center text-on-surface-variant">
            do portfela..
          </div>
          <SelectOutlined
            className="w-full"
            label="portfel"
            name="toWalletId"
            onChange={(e) =>
              setToWallet(
                wallets.find(
                  (wallet) => wallet.id === parseInt(e.currentTarget.value)
                )
              )
            }
            error={state?.errors?.toWalletId ? true : false}
            errorText={state?.errors?.toWalletId[0] ?? ""}
            disabled={toType === null}
            value={toWallet.id.toString()}
          >
            <Icon className="fill" slot="leading-icon">
              wallet
            </Icon>
            {toType === 0 && fromType !== 0 && (
              <SelectOption
                value={wallets
                  .filter((wallet) => wallet.wallet_type_id === 1)
                  .at(0)
                  .id.toString()}
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
            {toType === 2 &&
              wallets
                .filter((wallet) => wallet.wallet_type_id > 5)
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
                  .id.toString()}
              >
                <div slot="headline">oszczędności</div>
              </SelectOption>
            )}
            {toType === 4 &&
              wallets
                .filter((wallet) => wallet.wallet_type_id === 4)
                .map((wallet) => (
                  <SelectOption key={wallet.id} value={wallet.id.toString()}>
                    <div slot="headline">{wallet.name}</div>
                  </SelectOption>
                ))}
            {toType === 5 &&
              wallets
                .filter((wallet) => wallet.wallet_type_id === 5)
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
            value={toType.toString()}
          >
            <Icon className="fill" slot="leading-icon">
              category
            </Icon>
            {[
              { name: "gotówka", id: 0 },
              { name: "konto", id: 1 },
              { name: "inwestycje", id: 2 },
              { name: "oszczędności", id: 3 },
              { name: "skarbonka", id: 4 },
              { name: "cel", id: 5 },
            ]
              .filter(
                (type) =>
                  (fromType === 0 && type.id !== 1) ||
                  (fromType === 1 && type.id !== 0) ||
                  ![0, 1].includes(fromType)
              )
              .map((type) => (
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
        <FilledButton disabled={pending}>dodaj transfer</FilledButton>
      </div>
    </form>
  );
}
