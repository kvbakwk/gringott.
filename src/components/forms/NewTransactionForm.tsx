"use client";

import { WalletT } from "@app/utils/db-actions/wallet";
import { CounterpartyT } from "@app/utils/db-actions/counterparty";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

import { createTransaction } from "@app/api/transaction/create";
import { getWallets } from "@app/api/wallet/get";
import { CategoryT, getCategories } from "@app/utils/db-actions/category";
import {
  SuperCategoryT,
  getSuperCategories,
} from "@app/utils/db-actions/super_category";
import { MethodT, getMethods } from "@app/utils/db-actions/method";
import {
  validateTransactionAmount,
  validateTransactionDate,
  validateTransactionDescription,
  validateTransactionCounterpartyId,
} from "@app/utils/validator";
import { SelectOption, SelectOutlined } from "../material/Select";
import { TextFieldOutlined } from "../material/TextField";
import { Checkbox } from "../material/Checkbox";
import { FilledButton, OutlinedButton } from "../material/Button";
import { Icon } from "@components/material/Icon";
import { getCounterparties } from "@app/api/counterparty/get";

export default function NewTransactionForm({ userId }: { userId: number }) {
  const router = useRouter();

  const [income, setIncome] = useState<boolean>(false);
  const [walletId, setWalletId] = useState<number>(0);
  const [superCategoryId, setSuperCategoryId] = useState<number>(0);

  const [wallets, setWallets] = useState<WalletT[]>([]);
  const [methods, setMethods] = useState<MethodT[]>([]);
  const [categories, setCategories] = useState<CategoryT[]>([]);
  const [superCategories, setSuperCategories] = useState<SuperCategoryT[]>([]);
  const [counterparties, setCounterparties] = useState<CounterpartyT[]>([]);

  const [success, setSuccess] = useState<boolean>(false);
  const [walletIdErr, setWalletIdErr] = useState<boolean>(false);
  const [methodIdErr, setMethodIdErr] = useState<boolean>(false);
  const [dateErr, setDateErr] = useState<boolean>(false);
  const [amountErr, setAmountErr] = useState<boolean>(false);
  const [descriptionErr, setDescriptionErr] = useState<boolean>(false);
  const [categoryIdErr, setCategoryIdErr] = useState<boolean>(false);
  const [counterpartyIdErr, setCounterpartyIdErr] = useState<boolean>(false);
  const [error, setError] = useState<boolean>(false);

  useEffect(() => {
    getWallets(userId).then((res) => {
      setWallets(
        res.filter(
          (wallet) => wallet.wallet_type_id === 1 || wallet.wallet_type_id === 2
        )
      );
    });
    getCounterparties(userId).then((res) => {
      setCounterparties(res.sort((a, b) => a.name.localeCompare(b.name)));
    });
  }, []);
  useEffect(() => {
    getMethods().then((res) => {
      setMethods(
        res.filter(
          (method) =>
            (walletId !== 0 &&
              method.cash === true &&
              wallets.filter((wallet) => wallet.id === walletId)[0]
                .wallet_type_id === 1) ||
            (walletId !== 0 &&
              method.bank === true &&
              wallets.filter((wallet) => wallet.id === walletId)[0]
                .wallet_type_id === 2)
        )
      );
    });
  }, [walletId]);
  useEffect(() => {
    getSuperCategories().then((res) => {
      setSuperCategories(
        res.filter(
          (superCategory) =>
            superCategory.income === Boolean(income) ||
            superCategory.outcome === !income
        )
      );
      setSuperCategoryId(0);
    });
  }, [income]);
  useEffect(() => {
    getCategories().then((res) =>
      setCategories(
        res.filter((category) => category.super_category_id === superCategoryId)
      )
    );
  }, [superCategoryId]);

  const handleSubmit = async (
    e: React.FormEvent<HTMLFormElement>
  ): Promise<void> => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);

    const walletId: number = parseInt(formData.get("walletId")?.toString());
    const income: boolean = Boolean(
      parseInt(formData.get("income").toString())
    );
    const methodId: number = parseInt(formData.get("methodId")?.toString());
    const date: Date = new Date(formData.get("date").toString());
    const amount: number = parseFloat(formData.get("amount").toString());
    const description: string = formData.get("description").toString();
    const categoryId: number = parseInt(formData.get("categoryId")?.toString());
    const counterpartyId: number = parseInt(formData.get("counterpartyId").toString());
    const important: boolean = formData.get("important")?.toString() === "on";

    console.log(await validateTransactionCounterpartyId(counterpartyId, userId))

    if (
      validateTransactionDate(date) &&
      validateTransactionAmount(amount) &&
      validateTransactionDescription(description) &&
      await validateTransactionCounterpartyId(counterpartyId, userId)
    ) {
      createTransaction(
        walletId,
        income,
        methodId,
        date,
        amount,
        description,
        categoryId,
        counterpartyId,
        important,
        userId,
        1
      )
        .then((res) => {
          setSuccess(res.createTransaction);
          setWalletIdErr(res.walletIdErr);
          setMethodIdErr(res.methodIdErr);
          setDateErr(res.dateErr);
          setAmountErr(res.amountErr);
          setDescriptionErr(res.descriptionErr);
          setCategoryIdErr(res.categoryIdErr);
          setCounterpartyIdErr(res.counterpartyIdErr);
          setError(false);
          if (res.createTransaction) router.back();
        })
        .catch(() => setError(true));
    } else {
      setSuccess(false);
      setWalletIdErr(false);
      setMethodIdErr(false);
      setDateErr(!validateTransactionDate(date));
      setAmountErr(!validateTransactionAmount(amount));
      setDescriptionErr(!validateTransactionDescription(description));
      setCategoryIdErr(false);
      setCounterpartyIdErr(!(await validateTransactionCounterpartyId(counterpartyId, userId)));
      setError(false);
    }
  };

  return (
    <form
      className="flex justify-center items-center gap-[30px] w-[500px] h-fit py-[60px]"
      onSubmit={handleSubmit}
    >
      <div className="flex flex-col justify-center items-center gap-[25px] w-[320px] px-[10px] py-[10px]">
        <SelectOutlined
          className="w-full"
          label="portfel"
          name="walletId"
          onChange={(e) => setWalletId(parseInt(e.currentTarget.value))}
          error={walletIdErr}
          errorText="wybierz poprawny portfel"
        >
          <Icon slot="leading-icon">wallet</Icon>
          {wallets
            .sort((a, b) => a.wallet_type_id - b.wallet_type_id)
            .map((wallet) => (
              <SelectOption key={wallet.id} value={wallet.id.toString()}>
                <div slot="headline">{wallet.name ?? "gotówka"}</div>
              </SelectOption>
            ))}
        </SelectOutlined>
        <SelectOutlined
          className="w-full"
          label="rodzaj"
          name="income"
          onChange={(e) =>
            setIncome(parseInt(e.currentTarget.value) ? true : false)
          }
        >
          <Icon slot="leading-icon">swap_vert</Icon>
          <SelectOption value="1">
            <div slot="headline">przychód</div>
          </SelectOption>
          <SelectOption value="0">
            <div slot="headline">rozchód</div>
          </SelectOption>
        </SelectOutlined>
        <SelectOutlined
          className="w-full"
          label="metoda"
          name="methodId"
          error={methodIdErr}
          errorText="wybierz poprawną metodę"
        >
          <Icon slot="leading-icon">tactic</Icon>
          {methods.map((method) => (
            <SelectOption key={method.id} value={method.id.toString()}>
              <div slot="headline">{method.name}</div>
            </SelectOption>
          ))}
        </SelectOutlined>
      </div>
      <div className="flex flex-col justify-center items-center gap-[25px] w-[320px] px-[10px] py-[10px]">
        <TextFieldOutlined
          className="w-full"
          label="data"
          name="date"
          type="datetime-local"
          error={dateErr}
          errorText="wybierz datę"
          value={new Date(new Date().getTime() + 2000 * 60 * 60)
            .toISOString()
            .slice(0, 16)}
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
          error={amountErr}
          errorText="wpisz poprawną kwotę"
          suffixText="zł"
        >
          <Icon slot="leading-icon">toll</Icon>
        </TextFieldOutlined>
        <TextFieldOutlined
          className="w-full"
          label="opis"
          name="description"
          error={descriptionErr}
          errorText="wpisz opis"
        >
          <Icon slot="leading-icon">reorder</Icon>
        </TextFieldOutlined>
        <SelectOutlined
          className="w-full"
          label="druga strona"
          name="counterpartyId"
          error={counterpartyIdErr}
          errorText="wybierz drugą stronę"
        >
          <Icon slot="leading-icon">group</Icon>
          {counterparties.map((counterparty) => (
            <SelectOption
              key={counterparty.id}
              value={counterparty.id.toString()}
            >
              <div slot="headline">{counterparty.name}</div>
            </SelectOption>
          ))}
        </SelectOutlined>
      </div>
      <div className="flex flex-col justify-center items-center gap-[25px] w-[320px] px-[10px] py-[10px]">
        <SelectOutlined
          className="w-full"
          label="kategoria"
          onChange={(e) => setSuperCategoryId(parseInt(e.currentTarget.value))}
        >
          <Icon className="fill" slot="leading-icon">
            category
          </Icon>
          {superCategories.map((superCategory) => (
            <SelectOption
              key={superCategory.id}
              value={superCategory.id.toString()}
            >
              <div slot="headline">{superCategory.name}</div>
            </SelectOption>
          ))}
        </SelectOutlined>
        <SelectOutlined
          className="w-full"
          label="podkategoria"
          name="categoryId"
          error={categoryIdErr}
          errorText="wybierz poprawną podkategorię"
        >
          <Icon slot="leading-icon">category</Icon>
          {categories.map((category) => (
            <SelectOption key={category.id} value={category.id.toString()}>
              <div slot="headline">{category.name}</div>
            </SelectOption>
          ))}
        </SelectOutlined>
        <label
          className="flex justify-center items-center text-[14px] text-outline tracking-wider"
          htmlFor="important"
        >
          <Checkbox
            className="m-[15px]"
            name="important"
            id="important"
            checked
          />
          istotna
        </label>
        <div className="flex justify-center items-center gap-[10px]">
          <OutlinedButton type="button" onClick={() => router.back()}>
            anuluj
          </OutlinedButton>
          <FilledButton>dodaj transakcję</FilledButton>
        </div>
      </div>
    </form>
  );
}
