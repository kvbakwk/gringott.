"use client";

import { WalletT } from "@app/utils/db-actions/wallet";
import { TransactionT } from "@app/utils/db-actions/transaction";
import { SuperCategoryT } from "@app/utils/db-actions/super_category";
import { CategoryT } from "@app/utils/db-actions/category";
import { MethodT } from "@app/utils/db-actions/method";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

import { getTransaction } from "@app/api/transaction/get";
import { editTransaction } from "@app/api/transaction/edit";
import { getWallets } from "@app/api/wallet/get";
import { getCategories } from "@app/utils/db-actions/category";
import { getSuperCategories } from "@app/utils/db-actions/super_category";
import { getMethods } from "@app/utils/db-actions/method";
import {
  validateTransactionAmount,
  validateTransactionDate,
  validateTransactionDescription,
  validateTransactionSubjectId,
} from "@app/utils/validator";
import { SelectOption, SelectOutlined } from "../../material/Select";
import { TextFieldOutlined } from "../../material/TextField";
import { Checkbox } from "../../material/Checkbox";
import { FilledButton, OutlinedButton } from "../../material/Button";
import { Icon } from "@components/material/Icon";
import { getSubjects } from "@app/api/subject/get";
import { SubjectT } from "@app/utils/db-actions/subject";
import Loading from "@components/Loading";

export default function EditTransactionForm({
  userId,
  transactionId,
}: {
  userId: number;
  transactionId: number;
}) {
  const router = useRouter();

  const [transactionReady, setTransactionReady] = useState<boolean>(false);
  const [walletsReady, setWalletsReady] = useState<boolean>(false);
  const [subjectsReady, setSubjectsReady] =
    useState<boolean>(false);
  const [methodsReady, setMethodsReady] = useState<boolean>(false);
  const [superCategoriesReady, setSuperCategoriesReady] =
    useState<boolean>(false);
  const [categoriesReady, setCategoriesReady] = useState<boolean>(false);

  const [income, setIncome] = useState<boolean>(false);
  const [walletId, setWalletId] = useState<number>(0);
  const [superCategoryId, setSuperCategoryId] = useState<number>(0);
  const [categoryId, setCategoryId] = useState<number>(0);
  const [methodId, setMethodId] = useState<number>(0);
  const [subjectId, setSubjectId] = useState<number>(0);

  const [transaction, setTransaction] = useState<TransactionT>(null);
  const [wallets, setWallets] = useState<WalletT[]>([]);
  const [methods, setMethods] = useState<MethodT[]>([]);
  const [categories, setCategories] = useState<CategoryT[]>([]);
  const [superCategories, setSuperCategories] = useState<SuperCategoryT[]>([]);
  const [subjects, setSubjects] = useState<SubjectT[]>([]);

  const [success, setSuccess] = useState<boolean>(false);
  const [walletIdErr, setWalletIdErr] = useState<boolean>(false);
  const [methodIdErr, setMethodIdErr] = useState<boolean>(false);
  const [dateErr, setDateErr] = useState<boolean>(false);
  const [amountErr, setAmountErr] = useState<boolean>(false);
  const [descriptionErr, setDescriptionErr] = useState<boolean>(false);
  const [categoryIdErr, setCategoryIdErr] = useState<boolean>(false);
  const [subjectIdErr, setSubjectIdErr] = useState<boolean>(false);
  const [error, setError] = useState<boolean>(false);

  useEffect(() => {
    getTransaction(transactionId)
      .then((res) => {
        setTransaction(res);
        setWalletId(res.wallet_id);
        setIncome(res.income);
        setSuperCategoryId(res.super_category.id);
        setCategoryId(res.category.id);
        setMethodId(res.method.id);
        setSubjectId(res.subject.id);
      })
      .finally(() => setTransactionReady(true));
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
        })
        .finally(() => setMethodsReady(true));
  }, [wallets, walletId]);
  useEffect(() => {
    getSuperCategories()
      .then((res) => {
        setSuperCategories(
          res.filter(
            (superCategory) =>
              superCategory.income === Boolean(income) ||
              superCategory.outcome === !income
          )
        );
      })
      .finally(() => setSuperCategoriesReady(true));
  }, [income]);
  useEffect(() => {
    getCategories()
      .then((res) =>
        setCategories(
          res.filter(
            (category) => category.super_category_id === superCategoryId
          )
        )
      )
      .finally(() => setCategoriesReady(true));
  }, [superCategoryId]);

  const handleSubmit = async (
    e: React.FormEvent<HTMLFormElement>
  ): Promise<void> => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);

    const walletId: number = transaction.wallet_id;
    const income: boolean = transaction.income;
    const methodId: number = parseInt(formData.get("methodId")?.toString());
    const date: Date = new Date(formData.get("date").toString());
    const amount: number = parseFloat(formData.get("amount").toString());
    const description: string = formData.get("description").toString();
    const categoryId: number = parseInt(formData.get("categoryId")?.toString());
    const subjectId: number = parseInt(
      formData.get("subjectId").toString()
    );
    const important: boolean = formData.get("important")?.toString() === "on";

    if (
      validateTransactionDate(date) &&
      validateTransactionAmount(amount) &&
      validateTransactionDescription(description) &&
      validateTransactionSubjectId(subjectId, userId)
    ) {
      editTransaction(
        transactionId,
        walletId,
        income,
        methodId,
        date,
        amount,
        description,
        categoryId,
        subjectId,
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
          setSubjectIdErr(res.subjectErr);
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
      setSubjectIdErr(!validateTransactionSubjectId(subjectId, userId));
      setError(false);
    }
  };

  if (transactionReady && walletsReady && subjectsReady && methodsReady && superCategoriesReady && categoriesReady)
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
            error={walletIdErr}
            errorText="wybierz poprawny portfel"
            value={walletId.toString()}
            disabled
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
            value={income ? "1" : "0"}
            disabled
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
            onChange={(e) => setMethodId(parseInt(e.currentTarget.value))}
            error={methodIdErr}
            errorText="wybierz poprawną metodę"
            value={methodId.toString()}
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
            value={
              transaction
                ? new Date(transaction.date.getTime() + 2000 * 60 * 60)
                    .toISOString()
                    .slice(0, 16)
                : ""
            }
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
            value={transaction ? transaction.amount.toString() : ""}
          >
            <Icon slot="leading-icon">toll</Icon>
          </TextFieldOutlined>
          <TextFieldOutlined
            className="w-full"
            label="opis"
            name="description"
            error={descriptionErr}
            errorText="wpisz opis"
            value={transaction ? transaction.description : ""}
          >
            <Icon slot="leading-icon">reorder</Icon>
          </TextFieldOutlined>
          <SelectOutlined
            className="w-full"
            label="druga strona"
            name="subjectId"
            error={subjectIdErr}
            errorText="wybierz drugą stronę"
            value={subjectId.toString()}
          >
            <Icon slot="leading-icon">group</Icon>
            {subjects.map((subject) => (
              <SelectOption
                key={subject.id}
                value={subject.id.toString()}
              >
                <div slot="headline">{subject.name}</div>
              </SelectOption>
            ))}
          </SelectOutlined>
        </div>
        <div className="flex flex-col justify-center items-center gap-[25px] w-[320px] px-[10px] py-[10px]">
          <SelectOutlined
            className="w-full"
            label="kategoria"
            onChange={(e) =>
              setSuperCategoryId(parseInt(e.currentTarget.value))
            }
            value={superCategoryId.toString()}
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
            onChange={(e) => setCategoryId(parseInt(e.currentTarget.value))}
            error={categoryIdErr}
            errorText="wybierz poprawną podkategorię"
            value={categoryId.toString()}
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
              checked={transaction ? transaction.important : true}
            />
            istotna
          </label>
          <div className="flex justify-center items-center gap-[10px]">
            <OutlinedButton type="button" onClick={() => router.back()}>
              anuluj
            </OutlinedButton>
            <FilledButton>zapisz zmiany</FilledButton>
          </div>
        </div>
      </form>
    );
  else return <Loading />;
}
