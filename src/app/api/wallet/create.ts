"use server";

import { Pool, QueryResult } from "pg";

import {
  validateWalletBalance,
  validateWalletName,
} from "@app/utils/validator";
import { createTransaction } from "../transaction/create";

export async function createWallet(
  name: string | null,
  balance: number,
  userId: number,
  typeId: number
) {
  const isValid: boolean =
    (name === null || validateWalletName(name)) &&
    validateWalletBalance(balance);

  if (isValid) {
    const client: Pool = new Pool();
    const res: QueryResult = await client.query(
      `INSERT INTO wallet (name, balance, user_id, wallet_type_id) VALUES ($1, $2, $3, $4) RETURNING id;`,
      [name, 0, userId, typeId]
    );
    await client.end();

    const now = new Date((new Date()).getTime() + (60 * 60 * 1000))
    console.log(now)
    if (balance > 0)
      await createTransaction(
        res.rows[0].id,
        true,
        7,
        now,
        balance,
        "kwota wejściowa",
        59,
        "Ty",
        true,
        userId,
        5
      );
  }

  return {
    createWallet: isValid,
    nameErr: !(name === null || validateWalletName(name)),
    balanceErr: !validateWalletBalance(balance),
  };
}
