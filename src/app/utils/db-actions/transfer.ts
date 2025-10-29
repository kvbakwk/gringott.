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

export async function getTransfersByUserId(id: number): Promise<TransferT[]> {
  const res: QueryResult = await pool.query(
    `${BASE_TRANSFER_QUERY} WHERE public.transfer.user_id = $1;`,
    [id]
  );
  return res.rows.map(mapRowToTransfer);
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
      JOIN public.wallet AS from_wallet 
        ON public.transfer.from_wallet_id = from_wallet.id 
      JOIN public.wallet AS to_wallet
        ON public.transfer.to_wallet_id = to_wallet.id 
`;

function mapRowToTransfer(row: any): TransferT {
  return {
    id: parseInt(row.id),
    date: new Date(row.date),
    amount: parseFloat(row.amount),
    user_id: parseInt(row.user_id),
    method: {
      id: parseInt(row.user_method_id),
      name: row.user_method_name,
    },
    from_wallet_id: parseInt(row.wallet_id),
    to_wallet_id: parseInt(row.wallet_id),
  };
}
