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
      setWallets(res);
      setWalletId(res[0].id);
    });
  }, []);
  useEffect(() => {
    getMethods().then((res) => {
      setMethods(
        res.filter(
          (method) =>
            (walletId !== 0 &&
              method.cash === true &&
              wallets.filter((wallet) => wallet.id === walletId)[0].cash) ||
            (walletId !== 0 &&
              method.bank === true &&
              !wallets.filter((wallet) => wallet.id === walletId)[0].cash)
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

  const transactionSubmit = async (formData: FormData): Promise<void> => {
    if (
      validateTransactionDate(formData.get("date").toString()) &&
      validateTransactionAmount(
        parseFloat(formData.get("amount").toString())
      ) &&
      validateTransactionDescription(formData.get("description").toString()) &&
      validateTransactionCounterparty(formData.get("acrossPerson").toString())
    ) {
      createTransaction(
        parseInt(formData.get("walletId")?.toString()),
        Boolean(parseInt(formData.get("income").toString())),
        parseInt(formData.get("methodId")?.toString()),
        formData.get("date").toString(),
        parseFloat(formData.get("amount").toString()),
        formData.get("description").toString(),
        parseInt(formData.get("categoryId")?.toString()),
        formData.get("acrossPerson").toString(),
        Boolean(formData.get("important")?.toString()),
        user_id
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
      setDateErr(!validateTransactionDate(formData.get("date").toString()));
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
          formData.get("acrossPerson").toString()
        )
      );
      setError(false);
    }
  };

  return (
    <>
      <form action={transactionSubmit}>
        <select
          name="walletId"
          onChange={(e) => setWalletId(parseInt(e.target.value))}
        >
          <option value={0} disabled>
            PORTFEL
          </option>
          {wallets.map((wallet) => (
            <option key={wallet.id} value={wallet.id}>
              {wallet.name ?? "gotówka"}
            </option>
          ))}
        </select>
        {walletIdErr && <span>wybierz poprawny portfel</span>}
        <select
          name="income"
          defaultValue={0}
          onChange={() => setIncome(income ? 0 : 1)}
        >
          <option value={1}>przychód</option>
          <option value={0}>rozchód</option>
        </select>
        <select defaultValue={0} name="methodId">
          <option value={0} disabled>
            METODA
          </option>
          {methods.map((method) => (
            <option key={method.id} value={method.id}>
              {method.name}
            </option>
          ))}
        </select>
        {methodIdErr && <span>wybierz poprawną metodę</span>}
        <input type="datetime-local" name="date" />
        {dateErr && <span>wybierz datę</span>}
        <input
          type="number"
          name="amount"
          min="0"
          step="0.01"
          placeholder="kwota"
        />
        {" zł "}
        {amountErr && <span>wpisz poprawną kwotę</span>}
        <input name="description" placeholder="opis" />
        {descriptionErr && <span>wpisz opis</span>}
        <select
          defaultValue={0}
          onChange={(e) => setSuperCategoryId(parseInt(e.target.value))}
        >
          <option value={0} disabled>
            KATEGORIA
          </option>
          {superCategories.map((superCategory) => (
            <option key={superCategory.id} value={superCategory.id}>
              {superCategory.name}
            </option>
          ))}
        </select>
        <select name="categoryId" defaultValue={0}>
          <option value={0} disabled>
            PODKATEGORIA
          </option>
          {categories.map((category) => (
            <option key={category.id} value={category.id}>
              {category.name}
            </option>
          ))}
        </select>
        {categoryIdErr && <span>wybierz poprawną podkategorię</span>}
        <input type="text" name="acrossPerson" placeholder="adresat" />
        {counterpartyErr && <span>wpisz adresata</span>}
        <input
          type="checkbox"
          name="important"
          id="important"
          defaultChecked
        />{" "}
        <label htmlFor="important">istotna</label>{" "}
        <input type="submit" value="dodaj transakcje" />
        {success && <span>transakcja dodana pomyślnie</span>}
        {error && (
          <span>
            niestety nie udało się dodać transakcji, spróbuj ponownie później
          </span>
        )}
      </form>
    </>
  );
}
