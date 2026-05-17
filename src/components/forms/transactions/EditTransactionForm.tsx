"use client";

import { useEffect, useState } from "react";

import { WalletT } from "@/types/wallet";
import { TransactionT } from "@/types/transaction";
import { MethodT } from "@/types/method";
import { SubjectT } from "@/types/subject";
import { CategoryT, CategoryTypeT } from "@/types/category";

import { editTransactionAPI } from "@services/transaction/edit";

import {
  validateTransactionAmount,
  validateTransactionDate,
  validateTransactionDescription,
  validateTransactionSubjectId,
} from "@utils/validator";

import { SelectOption, SelectOutlined } from "@components/material/Select";
import { TextFieldOutlined } from "@components/material/TextField";
import { Checkbox } from "@components/material/Checkbox";
import { FilledButton, OutlinedButton } from "@components/material/Button";
import { Icon } from "@components/material/Icon";

export default function EditTransactionForm({
  userId,
  wallets,
  transaction,
  methods,
  subjects,
  categoryTypes,
  categories,
  successOperation,
  cancelOperation,
}: {
  userId: number;
  wallets: WalletT[];
  transaction: TransactionT;
  methods: MethodT[];
  subjects: SubjectT[];
  categoryTypes: CategoryTypeT[];
  categories: CategoryT[];
  successOperation: () => void;
  cancelOperation: () => void;
}) {
  const [income, setIncome] = useState<boolean>(transaction.income);
  const [walletId, setWalletId] = useState<number>(transaction.wallet_id);
  const [categoryTypeId, setCategoryTypeId] = useState<number>(
    transaction.category_type_id,
  );
  const [categoryId, setCategoryId] = useState<number>(transaction.category_id);
  const [methodId, setMethodId] = useState<number>(transaction.method_id);
  const [subjectId, setSubjectId] = useState<number>(transaction.subject_id);

  const [tempMethods, setTempMethods] = useState<MethodT[]>(
    wallets.length
      ? methods.filter(
          (method) =>
            (walletId !== 0 &&
              method.cash === true &&
              wallets.filter((wallet) => wallet.id === walletId)[0]
                .wallet_type_id === 1) ||
            (walletId !== 0 &&
              method.bank === true &&
              wallets.filter((wallet) => wallet.id === walletId)[0]
                .wallet_type_id === 2),
        )
      : [],
  );
  const [tempSubjects, setTempSubjects] = useState<SubjectT[]>(
    subjects.sort((a, b) => a.name.localeCompare(b.name)),
  );
  const [tempCategoryTypes, setTempCategoryTypes] = useState<CategoryTypeT[]>(
    categoryTypes.filter((type) =>
      categories.some(
        (cat) =>
          cat.category_type_id === type.id &&
          (income ? cat.income : cat.outcome),
      ),
    ),
  );
  const [tempCategories, setTempCategories] = useState<CategoryT[]>(
    categories.filter(
      (category) =>
        category.category_type_id === categoryTypeId &&
        (income ? category.income : category.outcome),
    ),
  );

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
    if (wallets.length)
      setTempMethods(
        methods.filter(
          (method) =>
            (walletId !== 0 &&
              method.cash === true &&
              wallets.filter((wallet) => wallet.id === walletId)[0]
                .wallet_type_id === 1) ||
            (walletId !== 0 &&
              method.bank === true &&
              wallets.filter((wallet) => wallet.id === walletId)[0]
                .wallet_type_id === 2),
        ),
      );
  }, [walletId]);
  useEffect(() => {
    setTempCategoryTypes(
      categoryTypes.filter((type) =>
        categories.some(
          (cat) =>
            cat.category_type_id === type.id &&
            (income ? cat.income : cat.outcome),
        ),
      ),
    );
  }, [income]);
  useEffect(() => {
    setTempCategories(
      categories.filter(
        (category) =>
          category.category_type_id === categoryTypeId &&
          (income ? category.income : category.outcome),
      ),
    );
  }, [categoryTypeId, income]);

  const handleSubmit = async (
    e: React.FormEvent<HTMLFormElement>,
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
    const subjectId: number = parseInt(formData.get("subjectId").toString());
    const important: boolean = formData.get("important")?.toString() === "on";

    if (
      validateTransactionDate(date) &&
      validateTransactionAmount(amount) &&
      validateTransactionDescription(description) &&
      validateTransactionSubjectId(subjectId, userId)
    ) {
      editTransactionAPI(
        transaction.id,
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
        1,
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
          if (res.createTransaction) successOperation();
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

  return (
    <form
      className="flex justify-center items-center gap-[30px] w-fit h-fit px-[90px] py-[90px] bg-surface border-1 border-yellow-500 rounded-2xl shadow-lg"
      onSubmit={handleSubmit}
    >
      <div className="flex flex-col justify-center items-center gap-[25px] w-[230px] px-[10px] py-[10px]">
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
          {tempMethods.map((method) => (
            <SelectOption key={method.id} value={method.id.toString()}>
              <div slot="headline">{method.name}</div>
            </SelectOption>
          ))}
        </SelectOutlined>
      </div>
      <div className="flex flex-col justify-center items-center gap-[25px] w-[250px] px-[10px] py-[10px]">
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
          {tempSubjects.map((subject) => (
            <SelectOption key={subject.id} value={subject.id.toString()}>
              <div slot="headline">{subject.name}</div>
            </SelectOption>
          ))}
        </SelectOutlined>
      </div>
      <div className="flex flex-col justify-center items-center gap-[25px] w-[230px] px-[10px] py-[10px]">
        <SelectOutlined
          className="w-full"
          label="kategoria"
          onChange={(e) => setCategoryTypeId(parseInt(e.currentTarget.value))}
          value={categoryTypeId.toString()}
        >
          <Icon className="fill" slot="leading-icon">
            category
          </Icon>
          {tempCategoryTypes.map((categoryType) => (
            <SelectOption
              key={categoryType.id}
              value={categoryType.id.toString()}
            >
              <div slot="headline">{categoryType.name}</div>
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
          {tempCategories.map((category) => (
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
          <OutlinedButton type="button" onClick={() => cancelOperation()}>
            anuluj
          </OutlinedButton>
          <FilledButton>zapisz zmiany</FilledButton>
        </div>
      </div>
    </form>
  );
}
