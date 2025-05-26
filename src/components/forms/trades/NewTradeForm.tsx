"use client";

import { WalletT } from "@app/utils/db-actions/wallet";
import { MethodT } from "@app/utils/db-actions/method";
import { SubjectT } from "@app/utils/db-actions/subject";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

import { getWallets } from "@app/api/wallet/get";
import { getMethods } from "@app/utils/db-actions/method";
import { getSubjects } from "@app/api/subject/get";

import {
  validateTradeAmount,
  validateTradeAtm,
  validateTradeDate,
  validateTradeDeposit,
} from "@app/utils/validator";

import Loading from "@components/Loading";
import { Icon } from "@components/material/Icon";
import { TextFieldOutlined } from "@components/material/TextField";
import { SelectOption, SelectOutlined } from "@components/material/Select";
import { FilledButton, OutlinedButton } from "@components/material/Button";
import { createTrade } from "@app/api/trade/create";

export default function NewTradeForm({ userId }: { userId: number }) {
  const router = useRouter();

  const [walletsReady, setWalletsReady] = useState<boolean>(false);
  const [methodsReady, setMethodsReady] = useState<boolean>(false);
  const [subjectsReady, setSubjectsReady] = useState<boolean>(false);

  const [atm, setAtm] = useState<boolean>(true);
  const [deposit, setDeposit] = useState<boolean>(false);

  const [wallets, setWallets] = useState<WalletT[]>([]);
  const [cashMethods, setCashMethods] = useState<MethodT[]>([]);
  const [bankMethods, setBankMethods] = useState<MethodT[]>([]);
  const [subjects, setSubjects] = useState<SubjectT[]>([]);

  const [success, setSuccess] = useState<boolean>(false);
  const [atmErr, setAtmErr] = useState<boolean>(false);
  const [depositErr, setDepositErr] = useState<boolean>(false);
  const [walletIdErr, setWalletIdErr] = useState<boolean>(false);
  const [userMethodIdErr, setUserMethodIdErr] = useState<boolean>(false);
  const [dateErr, setDateErr] = useState<boolean>(false);
  const [amountErr, setAmountErr] = useState<boolean>(false);
  const [subjectIdErr, setSubjectIdErr] = useState<boolean>(false);
  const [subjectMethodIdErr, setSubjectMethodIdErr] = useState<boolean>(false);
  const [error, setError] = useState<boolean>(false);

  useEffect(() => {
    getWallets(userId)
      .then((res) => {
        setWallets(res.filter((wallet) => wallet.wallet_type_id === 2));
      })
      .finally(() => setWalletsReady(true));
  }, []);
  useEffect(() => {
    getMethods()
      .then((res) => {
        setCashMethods(res.filter((method) => method.cash === true));
        setBankMethods(res.filter((method) => method.bank === true));
      })
      .finally(() => setMethodsReady(true));
  }, [deposit]);
  useEffect(() => {
    getSubjects(userId)
      .then((res) => setSubjects(res))
      .finally(() => setSubjectsReady(true));
  }, []);

  const handleSubmit = async (
    e: React.FormEvent<HTMLFormElement>
  ): Promise<void> => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);

    const atm: boolean = Boolean(parseInt(formData.get("atm")?.toString()));
    const walletId: number = parseInt(formData.get("walletId")?.toString());
    const deposit: boolean = Boolean(
      parseInt(formData.get("deposit")?.toString())
    );
    const userMethodId: number = parseInt(
      formData.get("userMethodId")?.toString()
    );
    const date: Date = new Date(formData.get("date").toString());
    const amount: number = parseFloat(formData.get("amount").toString());
    const subjectId: number = parseInt(formData.get("subjectId")?.toString());
    const subjectMethodId: number = parseInt(
      formData.get("subjectMethodId")?.toString()
    );

    if (
      validateTradeAtm(atm) &&
      validateTradeDeposit(deposit) &&
      validateTradeDate(date) &&
      validateTradeAmount(amount)
    ) {
      createTrade(
        atm,
        walletId,
        deposit,
        userMethodId,
        date,
        amount,
        subjectId,
        subjectMethodId,
        userId
      ).then((res) => {
        setSuccess(res.createTrade);
        setAtmErr(res.atmErr);
        setWalletIdErr(res.walletIdErr);
        setDepositErr(res.depositErr);
        setUserMethodIdErr(res.userMethodIdErr);
        setDateErr(res.dateErr);
        setAmountErr(res.amountErr);
        setSubjectIdErr(res.subjectIdErr);
        setSubjectMethodIdErr(res.subjectMethodIdErr);
        setError(false);
      });
    } else {
      setSuccess(false);
      setAtmErr(!validateTradeAtm(atm));
      setWalletIdErr(false);
      setDepositErr(!validateTradeDeposit(deposit));
      setUserMethodIdErr(false);
      setDateErr(!validateTradeDate(date));
      setAmountErr(!validateTradeAmount(amount));
      setSubjectIdErr(false);
      setSubjectMethodIdErr(false);
      setError(false);
    }
  };

  if (walletsReady && methodsReady && subjectsReady)
    return (
      <form
        className="flex flex-col justify-center items-center gap-[30px] w-fit h-fit py-[60px]"
        onSubmit={handleSubmit}
      >
        <SelectOutlined
          className="w-[300px]"
          label="wymiana.."
          name="atm"
          onChange={(e) =>
            setAtm(parseInt(e.currentTarget.value) ? true : false)
          }
          value={atm ? "1" : "0"}
          error={atmErr}
          errorText="wybierz typ wymiany"
        >
          {atm ? (
            <Icon className="fill" slot="leading-icon">
              atm
            </Icon>
          ) : (
            <Icon className="fill" slot="leading-icon">
              person
            </Icon>
          )}
          <SelectOption value="1">
            <div slot="headline">w bankomacie</div>
          </SelectOption>
          <SelectOption value="0">
            <div slot="headline">z kimś</div>
          </SelectOption>
        </SelectOutlined>
        <div className="flex gap-[30px]">
          <div className="flex flex-col gap-[25px] w-[260px]">
            <SelectOutlined
              className="w-full"
              label="konto"
              name="walletId"
              error={walletIdErr}
              errorText="wybierz portfel"
            >
              <Icon className="fill" slot="leading-icon">
                wallet
              </Icon>
              {wallets.map((wallet) => (
                <SelectOption key={wallet.id} value={wallet.id.toString()}>
                  <div slot="headline">{wallet.name}</div>
                </SelectOption>
              ))}
            </SelectOutlined>
            <SelectOutlined
              className="w-full"
              label="rodzaj"
              name="deposit"
              onChange={(e) =>
                setDeposit(parseInt(e.currentTarget.value) ? true : false)
              }
              value={deposit ? "1" : "0"}
              error={depositErr}
              errorText="wybierz rodzaj wymiany"
            >
              <Icon className="fill" slot="leading-icon">
                swap_vert
              </Icon>
              <SelectOption value="1">
                <div slot="headline">wpłata</div>
              </SelectOption>
              <SelectOption value="0">
                <div slot="headline">wypłata</div>
              </SelectOption>
            </SelectOutlined>
            <SelectOutlined
              className="w-full"
              label="metoda"
              name="userMethodId"
              error={userMethodIdErr}
              errorText="wybierz swoją metodę"
              disabled={atm}
            >
              <Icon className="fill" slot="leading-icon">
                tactic
              </Icon>
              {deposit
                ? cashMethods.map((method) => (
                    <SelectOption key={method.id} value={method.id.toString()}>
                      <div slot="headline">{method.name}</div>
                    </SelectOption>
                  ))
                : bankMethods.map((method) => (
                    <SelectOption key={method.id} value={method.id.toString()}>
                      <div slot="headline">{method.name}</div>
                    </SelectOption>
                  ))}
            </SelectOutlined>
          </div>
          <div className="flex flex-col gap-[25px] w-[230px]">
            <TextFieldOutlined
              className="w-full"
              label="data"
              name="date"
              type="datetime-local"
              value={new Date(new Date().getTime() + 2000 * 60 * 60)
                .toISOString()
                .slice(0, 16)}
              error={dateErr}
              errorText="wybierz datę"
            >
              <Icon slot="leading-icon">event</Icon>
            </TextFieldOutlined>
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
          </div>
          <div className="flex flex-col gap-[25px] w-[260px]">
            <SelectOutlined
              className="w-full"
              label="druga strona"
              name="subjectId"
              error={subjectIdErr}
              errorText="wybierz drugą stronę"
            >
              <Icon className="fill" slot="leading-icon">
                person
              </Icon>
              {subjects.map((subject) => (
                <SelectOption key={subject.id} value={subject.id.toString()}>
                  <div slot="headline">{subject.name}</div>
                </SelectOption>
              ))}
            </SelectOutlined>
            <SelectOutlined
              className="w-full"
              label="metoda"
              name="subjectMethodId"
              error={subjectMethodIdErr}
              errorText="wybierz metodę drugiej strony"
              disabled={atm}
            >
              <Icon className="fill" slot="leading-icon">
                tactic
              </Icon>
              {deposit
                ? bankMethods.map((method) => (
                    <SelectOption key={method.id} value={method.id.toString()}>
                      <div slot="headline">{method.name}</div>
                    </SelectOption>
                  ))
                : cashMethods.map((method) => (
                    <SelectOption key={method.id} value={method.id.toString()}>
                      <div slot="headline">{method.name}</div>
                    </SelectOption>
                  ))}
            </SelectOutlined>
          </div>
        </div>
        <div className="flex justify-end items-center gap-[10px] w-full">
          <OutlinedButton type="button" onClick={() => router.back()}>
            anuluj
          </OutlinedButton>
          <FilledButton>dodaj wymianę</FilledButton>
        </div>
      </form>
    );
  else return <Loading />;
}
