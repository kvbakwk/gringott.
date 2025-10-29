"use client";

import { WalletT } from "@app/utils/db-actions/wallet";
import { MethodT } from "@app/utils/db-actions/method";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

import { getWallets } from "@app/api/wallet/get";
import { getMethodsAPI } from "@app/api/method/get";
import { FilledButton, OutlinedButton } from "@components/material/Button";
import { SelectOption, SelectOutlined } from "@components/material/Select";
import { TextFieldOutlined } from "@components/material/TextField";
import { Icon } from "@components/material/Icon";
import Loading from "@components/Loading";

export default function NewTransferForm({
  userId,
  wallets,
  methods,
  walletsReady,
  methodsReady,
  successOperation,
  cancelOperation,
}: {
  userId: number;
  wallets: WalletT[];
  methods: MethodT[];
  walletsReady: boolean;
  methodsReady: boolean;
  successOperation: () => void;
  cancelOperation: () => void;
}) {
  const router = useRouter();

  const [fromType, setFromType] = useState<number>(null);
  const [toType, setToType] = useState<number>(null);

  const [success, setSuccess] = useState<boolean>(false);
  const [fromWalletIdErr, setFromWalletIdErr] = useState<boolean>(false);
  const [amountErr, setAmountErr] = useState<boolean>(false);
  const [methodIdErr, setMethodIdErr] = useState<boolean>(false);
  const [toWalletIdErr, setToWalletIdErr] = useState<boolean>(false);
  const [error, setError] = useState<boolean>(false);

  const handleSubmit = async (
    e: React.FormEvent<HTMLFormElement>
  ): Promise<void> => {
    e.preventDefault();
  };

  if (walletsReady && methodsReady)
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
              error={fromWalletIdErr}
              errorText="wybierz portfel"
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
              error={amountErr}
              errorText="wpisz poprawną kwotę"
            >
              <Icon slot="leading-icon">toll</Icon>
            </TextFieldOutlined>
            <SelectOutlined
              className="w-full"
              label="metoda"
              name="methodId"
              error={methodIdErr}
              errorText="wybierz metodę"
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
              error={toWalletIdErr}
              errorText="wybierz portfel"
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
          <FilledButton>dodaj transfer</FilledButton>
        </div>
      </form>
    );
  else return <Loading />;
}
