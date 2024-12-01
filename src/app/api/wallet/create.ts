"use server"

import { Pool, QueryResult } from "pg";

import {
  validateWalletBalance,
  validateWalletName,
} from "@app/utils/validator";

export async function createCashWallet(balance: number, user_id: number) {
  const isValid: boolean =
    validateWalletBalance(balance);
  if (isValid) {
    const client: Pool = new Pool();
    await client.query(
      `INSERT INTO wallet (balance, user_id, cash) VALUES ($1, $2, true);`,
      [balance, user_id]
    );
    await client.end();
  }

  return {
    createWallet: isValid,
    balanceErr: !validateWalletBalance(balance),
  };
}

export async function createBankWallet(name: string, balance: number, user_id: number) {
  const isValid: boolean =
    validateWalletName(name) && validateWalletBalance(balance);
  if (isValid) {
    const client: Pool = new Pool();
    await client.query(
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
