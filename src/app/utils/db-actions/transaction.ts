"use server";

import { QueryResult } from "pg";

import pool from "../db";

export interface TransactionT {
  id: number;
  date: Date;
  amount: number;
  description: string;
  super_category: {
    id: number;
    name: string;
  };
  category: {
    id: number;
    name: string;
  };
  subject: {
    id: number;
    name: string;
  };
  income: boolean;
  important: boolean;
  user_id: number;
  wallet_id: number;
  method: {
    id: number;
    name: string;
  };
  transaction_type_id: number;
}
export interface TransactionIdT {
  id: number;
}

export async function getTransactionById(id: number): Promise<TransactionT> {
  const res: QueryResult = await pool.query(
    `${BASE_TRANSACTION_QUERY} WHERE public.transaction.id = $1;`,
    [id]
  );
  return mapRowToTransaction(res.rows[0]);
}
export async function getTransactionsByWalletId(
  id: number
): Promise<TransactionT[]> {
  const res: QueryResult = await pool.query(
    `${BASE_TRANSACTION_QUERY} WHERE wallet_id = $1;`,
    [id]
  );
  return res.rows.map(mapRowToTransaction);
}
export async function getTransactionsByUserId(
  id: number
): Promise<TransactionT[]> {
  const res: QueryResult = await pool.query(
    `${BASE_TRANSACTION_QUERY} WHERE public.transaction.user_id = $1;`,
    [id]
  );
  return res.rows.map(mapRowToTransaction);
}
export async function getTransactionsIdsByWalletId(
  id: number
): Promise<TransactionIdT[]> {
  const res: QueryResult = await pool.query(
    "SELECT id FROM public.transaction WHERE wallet_id = $1;",
    [id]
  );
  return res.rows.map(mapRowToTransactionId);
}
export async function getTransactionsIdsBySubjectId(
  id: number
): Promise<TransactionIdT[]> {
  const res: QueryResult = await pool.query(
    "SELECT id FROM public.transaction WHERE subject_id = $1;",
    [id]
  );
  return res.rows.map(mapRowToTransactionId);
}
export async function getTransactionAmount(id: number): Promise<number> {
  const res: QueryResult = await pool.query(
    "SELECT amount FROM public.transaction WHERE id = $1;",
    [id]
  );
  return res.rows[0].amount;
}

export async function createTransaction(
  date: Date,
  amount: number,
  description: string,
  categoryId: number,
  subjectId: number,
  income: boolean,
  important: boolean,
  userId: number,
  walletId: number,
  methodId: number,
  transactionTypeId: number
): Promise<number> {
  const res = await pool.query(
    `INSERT INTO public.transaction 
      (date, amount, description, category_id, subject_id, income, important, user_id, wallet_id, method_id, transaction_type_id)
     VALUES 
      ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11);`,
    [
      date,
      amount,
      description,
      categoryId,
      subjectId,
      income,
      important,
      userId,
      walletId,
      methodId,
      transactionTypeId,
    ]
  );
  return res.rowCount;
}
export async function editTransaction(
  date: Date,
  amount: number,
  description: string,
  categoryId: number,
  subjectId: number,
  important: boolean,
  methodId: number,
  transactionTypeId: number,
  transactionId: number
): Promise<number> {
  const res = await pool.query(
    `UPDATE public.transaction 
    SET 
      date = $1, amount = $2, description = $3, category_id = $4, 
      subject_id = $5, important = $6, method_id = $7, 
      transaction_type_id = $8 
    WHERE id = $9;`,
    [
      date,
      amount,
      description,
      categoryId,
      subjectId,
      important,
      methodId,
      transactionTypeId,
      transactionId,
    ]
  );
  return res.rowCount;
}
export async function deleteTransaction(
  transactionId: number
): Promise<number> {
  const res = await pool.query(
    `DELETE FROM public.transaction WHERE id = $1;`,
    [transactionId]
  );
  return res.rowCount;
}

const BASE_TRANSACTION_QUERY = `
    SELECT
        public.transaction.id,
        public.transaction.date,
        public.transaction.amount,
        public.transaction.description,
        public.super_category.id as super_category_id,
        public.super_category.name as super_category_name,
        public.category.id as category_id,
        public.category.name as category_name,
        public.subject.id as subject_id,
        public.subject.name as subject_name,
        public.transaction.income,
        public.transaction.important,
        public.transaction.user_id,
        public.transaction.wallet_id,
        public.method.id as method_id,
        public.method.name as method_name,
        public.transaction.transaction_type_id
    FROM public.transaction
    JOIN public.category ON public.transaction.category_id = public.category.id
    JOIN public.subject ON public.transaction.subject_id = public.subject.id
    JOIN public.method ON public.transaction.method_id = public.method.id
    JOIN public.super_category ON public.category.super_category_id = public.super_category.id
`;

function mapRowToTransaction(row: any): TransactionT {
  return {
    id: parseInt(row.id),
    date: new Date(row.date),
    amount: parseFloat(row.amount),
    description: row.description,
    super_category: {
      id: parseInt(row.super_category_id),
      name: row.super_category_name,
    },
    category: {
      id: parseInt(row.category_id),
      name: row.category_name,
    },
    subject: {
      id: parseInt(row.subject_id),
      name: row.subject_name,
    },
    income: Boolean(row.income),
    important: Boolean(row.important),
    user_id: parseInt(row.user_id),
    wallet_id: parseInt(row.wallet_id),
    method: {
      id: parseInt(row.method_id),
      name: row.method_name,
    },
    transaction_type_id: parseInt(row.transaction_type_id),
  };
}
function mapRowToTransactionId(row: any): TransactionIdT {
  return {
    id: parseInt(row.id),
  };
}
