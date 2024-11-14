"use client";

import { createTransaction } from "@app/api/transaction/create";

export default function NewTransactionForm({ user_id }) {
  const transactionSubmit = async (formData: FormData): Promise<void> => {
    console.log(formData.get("category"))
    const res = await createTransaction(
      formData.get("date").toString(),
      formData.get("amount").toString(),
      formData.get("description").toString(),
      formData.get("category")?.toString(),
      formData.get("receiver").toString(),
      user_id
    );
  };

  return (
    <>
      <form action={transactionSubmit}>
        <input type="datetime-local" name="date" placeholder="data" />
        <input
          type="number"
          name="amount"
          id="amount"
          step="0.01"
          min="0"
          placeholder="kwota"
        />
        {" zł "}
        <input type="text" name="description" placeholder="opis" />
        <select name="category" defaultValue="0">
            <option value="0" disabled>kategoria</option>
            <option value="1">opcja 1</option>
            <option value="1">opcja 2</option>
        </select>
        <input type="text" name="receiver" placeholder="adresat" />
        <input type="submit" value="dodaj transakcje" />
      </form>
    </>
  );
}
