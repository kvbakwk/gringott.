"use client";

import { WalletT } from "@app/utils/db-actions/wallet";
import { TradeT } from "@app/utils/db-actions/trade";
import { MethodT } from "@app/utils/db-actions/method";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

import { getTrade } from "@app/api/trade/get";
import { getWallets } from "@app/api/wallet/get";
import { getMethods } from "@app/utils/db-actions/method";
import { SelectOption, SelectOutlined } from "../../material/Select";
import { TextFieldOutlined } from "../../material/TextField";
import { FilledButton, OutlinedButton } from "../../material/Button";
import { Icon } from "@components/material/Icon";
import { getSubjects } from "@app/api/subject/get";
import { SubjectT } from "@app/utils/db-actions/subject";
import Loading from "@components/Loading";
import { validateTradeAmount, validateTradeAtm, validateTradeDate, validateTradeDeposit } from "@app/utils/validator";
import { editTradeAPI } from "@app/api/trade/edit";

export default function EditTradeForm({
  userId,
  tradeId,
}: {
  userId: number;
  tradeId: number;
}) {
  const router = useRouter();

  const [tradeReady, setTradeReady] = useState<boolean>(false);
  const [walletsReady, setWalletsReady] = useState<boolean>(false);
  const [methodsReady, setMethodsReady] = useState<boolean>(false);
  const [subjectsReady, setSubjectsReady] = useState<boolean>(false);

  const [trade, setTrade] = useState<TradeT>(null);
  const [wallets, setWallets] = useState<WalletT[]>([]);
  const [cashMethods, setCashMethods] = useState<MethodT[]>([]);
  const [bankMethods, setBankMethods] = useState<MethodT[]>([]);
  const [subjects, setSubjects] = useState<SubjectT[]>([]);

  const [atm, setAtm] = useState<boolean>(false);
  const [walletId, setWalletId] = useState<number>(0);
  const [deposit, setDeposit] = useState<boolean>(false);
  const [userMethodId, setUserMethodId] = useState<number>(0);
  const [subjectMethodId, setSubjectMethodId] = useState<number>(0);

  const [success, setSuccess] = useState<boolean>(false);
  const [tradeIdErr, setTradeIdErr] = useState<boolean>(false);
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
    getTrade(tradeId)
      .then((res) => {
        if (!res || res.user_id !== userId) setTradeIdErr(true);
        else {
          setTrade(res);
          setAtm(res.atm);
          setWalletId(res.wallet_id);
          setDeposit(res.deposit);
          setUserMethodId(res.user_method.id);
          setSubjectMethodId(res.subject_method.id);
        }
      })
      .finally(() => setTradeReady(true));
    getWallets(userId)
      .then((res) => {
        setWallets(
          res.filter(
            (wallet) =>
              wallet.wallet_type_id === 1 || wallet.wallet_type_id === 2
          )
        );
      })
      .finally(() => setWalletsReady(true));
    getSubjects(userId)
      .then((res) => {
        setSubjects(res.sort((a, b) => a.name.localeCompare(b.name)));
      })
      .finally(() => setSubjectsReady(true));
  }, []);
  useEffect(() => {
    if (wallets.length)
      getMethods()
        .then((res) => {
          setCashMethods(res.filter((method) => method.cash));
          setBankMethods(res.filter((method) => method.bank));
        })
        .finally(() => setMethodsReady(true));
  }, [wallets, walletId]);

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
      editTradeAPI(
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
        setSuccess(res.editTrade);
        setAtmErr(res.atmErr);
        setWalletIdErr(res.walletIdErr);
        setDepositErr(res.depositErr);
        setUserMethodIdErr(res.userMethodIdErr);
        setDateErr(res.dateErr);
        setAmountErr(res.amountErr);
        setSubjectIdErr(res.subjectIdErr);
        setSubjectMethodIdErr(res.subjectMethodIdErr);
        setError(false);
        if(res.editTrade) router.back()
      })
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

  if (
    tradeReady &&
    walletsReady &&
    subjectsReady &&
    methodsReady &&
    !tradeIdErr
  )
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
              value={walletId.toString()}
              error={walletIdErr}
              errorText="wybierz portfel"
            >
              <Icon className="fill" slot="leading-icon">
                wallet
              </Icon>
              {wallets
                .filter((wallet) => wallet.wallet_type_id === 2)
                .map((wallet) => (
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
              value={userMethodId.toString()}
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
              value={new Date(trade.date.getTime() + 2000 * 60 * 60)
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
              value={trade.amount.toString()}
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
              value={trade.subject.id.toString()}
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
              value={subjectMethodId.toString()}
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
          <FilledButton>edytuj wymianę</FilledButton>
        </div>
      </form>
    );
  else if (tradeIdErr)
    return (
      <div className="text-error text-[18px] text-center">
        wymiana, którą próbujesz edytować nie należy do Ciebie
      </div>
    );
  else return <Loading />;
}
