"use server"

import { Pool, QueryResult } from "pg";

import {
  validateTransactionDate,
  validateTransactionAmount,
  validateTransactionDescription,
  validateTransactionCategory,
  validateTransactionReceiver,
} from "@app/utils/validator";

export async function createTransaction(date, amount, description, category, receiver, user_id) {
  const isValid: boolean =
    validateTransactionDate(date) &&
    validateTransactionAmount(amount) &&
    validateTransactionDescription(description) &&
    validateTransactionCategory(category) &&
    validateTransactionReceiver(receiver);
  if (isValid) {
    const client: Pool = new Pool();
    const res: QueryResult = await client.query(
      `INSERT INTO public.transaction (name, balance, user_id, cash) VALUES ($1, $2, $3, false);`,
      [name, balance, user_id]
    );
    await client.end();
  }

  return {
    createTransaction: isValid,
    dateErr: !validateTransactionDate(date),
    amountErr: !validateTransactionAmount(amount),
    descriptionErr: !validateTransactionDescription(description),
    categoryErr: !validateTransactionCategory(category),
    receiverErr: !validateTransactionReceiver(receiver),
  };
}
