"use server"

import { Pool, QueryResult } from "pg";

import {
  validateWalletBalance,
  validateWalletName,
} from "@app/utils/validator";

export async function createWallet(name, balance, user_id) {
  const isValid: boolean =
    validateWalletName(name) && validateWalletBalance(balance);
    console.log(balance)    
  if (isValid) {
    const client: Pool = new Pool();
    const res: QueryResult = await client.query(
      `INSERT INTO wallet (name, balance, user_id, cash) VALUES ($1, $2, $3, false);`,
      [name, balance, user_id]
    );
    await client.end();
  }

  return {
    createWallet: isValid,
    nameErr: !validateWalletName(name),
    balanceErr: !validateWalletBalance(balance),
  };
}
