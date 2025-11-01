"use server";

import { QueryResult } from "pg";

import pool from "../db";

export interface TransferT {
  id: number;
  date: Date;
  amount: number;
  user_id: number;
  method: {
    id: number;
    name: string;
  };
  from_wallet_id: number;
  to_wallet_id: number;
}
export interface TransferIdT {
  id: number;
}

export async function getTransferById(id: number): Promise<TransferT> {
  const res: QueryResult = await pool.query(
    `${BASE_TRANSFER_QUERY} WHERE public.transfer.id = $1;`,
    [id]
  );
  return mapRowToTransfer(res.rows[0]);
}
export async function getTransfersByUserId(id: number): Promise<TransferT[]> {
  const res: QueryResult = await pool.query(
    `${BASE_TRANSFER_QUERY} WHERE public.transfer.user_id = $1;`,
    [id]
  );
  return res.rows.map(mapRowToTransfer);
}

export async function createTransfer(
  date: Date,
  amount: number,
  userId: number,
  fromWalletId: number,
  methodId: number,
  toWalletId: number
): Promise<number> {
  const res = await pool.query(
    `INSERT INTO public.transfer
      (date, amount, user_id, method_id, from_wallet_id, to_wallet_id) 
     VALUES
      ($1, $2, $3, $4, $5, $6);`,
    [date, amount, userId, methodId, fromWalletId, toWalletId]
  );
  return res.rowCount;
}

export async function editTransfer(
  id: number,
  date: Date,
  amount: number,
  fromWalletId: number,
  methodId: number,
  toWalletId: number
): Promise<number> {
  const res = await pool.query(
    `UPDATE public.transfer 
    SET 
      date = $1, amount = $2, method_id = $3, 
      from_wallet_id = $4, to_wallet_id = $5
    WHERE id = $6;`,
    [date, amount, methodId, fromWalletId, toWalletId, id]
  );
  return res.rowCount;
}
export async function deleteTransfer(id: number): Promise<number> {
  const res = await pool.query(`DELETE FROM public.transfer WHERE id = $1;`, [
    id,
  ]);
  return res.rowCount;
}

const BASE_TRANSFER_QUERY = `
    SELECT 
      public.transfer.id, date, amount, 
      public.transfer.user_id, 
      method.id as method_id, method.name as method_name, 
      public.transfer.from_wallet_id, public.transfer.to_wallet_id
      FROM public.transfer
      JOIN public.method AS method 
        ON public.transfer.method_id = method.id
`;

function mapRowToTransfer(row: any): TransferT {
  return {
    id: parseInt(row.id),
    date: new Date(row.date),
    amount: parseFloat(row.amount),
    user_id: parseInt(row.user_id),
    method: {
      id: parseInt(row.method_id),
      name: row.method_name,
    },
    from_wallet_id: parseInt(row.from_wallet_id),
    to_wallet_id: parseInt(row.to_wallet_id),
  };
}
