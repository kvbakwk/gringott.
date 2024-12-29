"use client";

import { useEffect, useState } from "react";
import { createTransaction } from "@app/api/transaction/create";
import { getCategories } from "@app/utils/db-actions/category";
import { getSuperCategories } from "@app/utils/db-actions/super_category";
import { getWallets } from "@app/api/wallet/get";
import { getMethods } from "@app/utils/db-actions/method";
import {
  validateTransactionAmount,
  validateTransactionDate,
  validateTransactionDescription,
  validateTransactionCounterparty,
} from "@app/utils/validator";
import { WalletT } from "@app/utils/db-actions/wallet";
import { SelectOption, SelectOutlined } from "../material/Select";
import { TextFieldOutlined } from "../material/TextField";
import { Checkbox } from "../material/Checkbox";
import { FilledButton } from "../material/Button";

export default function NewTransactionForm({ user_id }: { user_id: number }) {
  const [income, setIncome] = useState(0);
  const [superCategoryId, setSuperCategoryId] = useState(0);
  const [walletId, setWalletId] = useState(0);

  const [wallets, setWallets] = useState<WalletT[]>([]);
  const [methods, setMethods] = useState([]);
  const [categories, setCategories] = useState([]);
  const [superCategories, setSuperCategories] = useState([]);

  const [success, setSuccess] = useState(false);
  const [walletIdErr, setWalletIdErr] = useState(false);
  const [methodIdErr, setMethodIdErr] = useState(false);
  const [dateErr, setDateErr] = useState(false);
  const [amountErr, setAmountErr] = useState(false);
  const [descriptionErr, setDescriptionErr] = useState(false);
  const [categoryIdErr, setCategoryIdErr] = useState(false);
  const [counterpartyErr, setCounterpartyErr] = useState(false);
  const [error, setError] = useState(false);

  useEffect(() => {
    getWallets(user_id).then((res) => {
      setWallets(
        res.filter(
          (wallet) => wallet.wallet_type_id === 1 || wallet.wallet_type_id === 2
        )
      );
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

    if (
      validateTransactionDate(new Date(formData.get("date").toString())) &&
      validateTransactionAmount(
        parseFloat(formData.get("amount").toString())
      ) &&
      validateTransactionDescription(formData.get("description").toString()) &&
      validateTransactionCounterparty(formData.get("counterparty").toString())
    ) {
      createTransaction(
        parseInt(formData.get("walletId")?.toString()),
        Boolean(parseInt(formData.get("income").toString())),
        parseInt(formData.get("methodId")?.toString()),
        new Date(formData.get("date").toString()),
        parseFloat(formData.get("amount").toString()),
        formData.get("description").toString(),
        parseInt(formData.get("categoryId")?.toString()),
        formData.get("counterparty").toString(),
        Boolean(formData.get("important")?.toString()),
        user_id,
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
          setCounterpartyErr(res.counterpartyErr);
          setError(false);
        })
        .catch(() => {
          setSuccess(false);
          setWalletIdErr(false);
          setMethodIdErr(false);
          setDateErr(false);
          setAmountErr(false);
          setDescriptionErr(false);
          setCategoryIdErr(false);
          setCounterpartyErr(false);
          setError(true);
        });
    } else {
      setSuccess(false);
      setWalletIdErr(false);
      setMethodIdErr(false);
      setDateErr(
        !validateTransactionDate(new Date(formData.get("date").toString()))
      );
      setAmountErr(
        !validateTransactionAmount(
          parseFloat(formData.get("amount").toString())
        )
      );
      setDescriptionErr(
        !validateTransactionDescription(formData.get("description").toString())
      );
      setCategoryIdErr(false);
      setCounterpartyErr(
        !validateTransactionCounterparty(
          formData.get("counterparty").toString()
        )
      );
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
          {wallets.map((wallet) => (
            <SelectOption key={wallet.id} value={wallet.id.toString()}>
              <div slot="headline">{wallet.name ?? "gotówka"}</div>
            </SelectOption>
          ))}
        </SelectOutlined>
        <SelectOutlined
          className="w-full"
          label="rodzaj"
          name="income"
          onChange={() => setIncome(income ? 0 : 1)}
        >
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
        />
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
        />
        <TextFieldOutlined
          className="w-full"
          label="opis"
          name="description"
          error={descriptionErr}
          errorText="wpisz opis"
        />
        <TextFieldOutlined
          className="w-full"
          label="druga strona"
          name="counterparty"
          error={counterpartyErr}
          errorText="wpisz drugą stronę"
        />
      </div>
      <div className="flex flex-col justify-center items-center gap-[25px] w-[320px] px-[10px] py-[10px]">
        <SelectOutlined
          className="w-full"
          label="kategoria"
          onChange={(e) => setSuperCategoryId(parseInt(e.currentTarget.value))}
        >
          {superCategories.map((superCategory) => (
            <SelectOption key={superCategory.id} value={superCategory.id}>
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
          {categories.map((category) => (
            <SelectOption key={category.id} value={category.id}>
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
        <FilledButton>dodaj transakcję</FilledButton>
      </div>
    </form>
  );
}
