"use server"

import { Pool, QueryResult } from "pg";

import {
  validateTransactionAmount,
  validateTransactionName,
} from "@app/utils/validator";

export async function createTransaction(date, amount, description, category, receiver, user_id) {
  const isValid: boolean =
    validateTransactionName(name) && validateTransactionBalance(balance);
  if (isValid) {
    const client: Pool = new Pool();
    const res: QueryResult = await client.query(
      `INSERT INTO Transaction (name, balance, user_id, cash) VALUES ($1, $2, $3, false);`,
      [name, balance, user_id]
    );
    await client.end();
  }

  return {
    createTransaction: isValid,
    nameErr: !validateTransactionName(name),
    balanceErr: !validateTransactionBalance(balance),
  };
}
