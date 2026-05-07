"use server";

import { QueryResult } from "pg";
import pool from "../db";

export interface TransactionT {
  id: number;
  date: Date;
  amount: number;
  description: string;
  super_category_id: number;
  super_category_name: string;
  category_id: number;
  category_name: string;
  subject_id: number;
  subject_name: string;
  income: boolean;
  important: boolean;
  user_id: number;
  wallet_id: number;
  method_id: number;
  method_name: string;
  transaction_type_id: number;
  loan_id?: number | null;
  updated_at: Date;
  deleted_at: Date | null;
}

interface TransactionRow {
  id: string | number;
  date: string | Date;
  amount: string | number;
  description: string;
  super_category_id: string | number;
  super_category_name: string;
  category_id: string | number;
  category_name: string;
  subject_id: string | number;
  subject_name: string;
  income: boolean;
  important: boolean;
  user_id: string | number;
  wallet_id: string | number;
  method_id: string | number;
  method_name: string;
  transaction_type_id: string | number;
  loan_id?: string | number | null;
  updated_at: string | Date;
  deleted_at: string | Date | null;
}

const BASE_TRANSACTION_QUERY = `
    SELECT
        t.id, t.date, t.amount, t.description, t.income, t.important, t.user_id, t.wallet_id, t.transaction_type_id, t.loan_id, t.updated_at, t.deleted_at,
        sc.id as super_category_id, sc.name as super_category_name,
        c.id as category_id, c.name as category_name,
        s.id as subject_id, s.name as subject_name,
        m.id as method_id, m.name as method_name
    FROM public.transactions t
    JOIN public.categories c ON t.category_id = c.id
    JOIN public.subjects s ON t.subject_id = s.id
    JOIN public.methods m ON t.method_id = m.id
    JOIN public.super_categories sc ON c.super_category_id = sc.id
`;

export async function getTransactionsByUserId(userId: number, since?: Date): Promise<TransactionT[]> {
  try {
    const query = since
      ? `${BASE_TRANSACTION_QUERY} WHERE t.user_id = $1 AND t.updated_at > $2`
      : `${BASE_TRANSACTION_QUERY} WHERE t.user_id = $1 AND t.deleted_at IS NULL;`;

    const params = since ? [userId, since] : [userId];
    const res: QueryResult<TransactionRow> = await pool.query(query, params);
    return res.rows.map(mapRowToTransaction);
  } catch (error) {
    console.error(`Error in getTransactionsByUserId for user ${userId}:`, error);
    return [];
  }
}

export async function createTransaction(
  data: Omit<TransactionT, 'id' | 'updated_at' | 'deleted_at' | 'super_category_id' | 'super_category_name' | 'category_name' | 'subject_name' | 'method_name'>
): Promise<number | null> {
  try {
    const res = await pool.query(
      `INSERT INTO public.transactions 
        (date, amount, description, category_id, subject_id, income, important, user_id, wallet_id, method_id, transaction_type_id, loan_id)
       VALUES 
        ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12) RETURNING id;`,
      [
        data.date, data.amount, data.description, data.category_id, data.subject_id, 
        data.income, data.important, data.user_id, data.wallet_id, data.method_id, 
        data.transaction_type_id, data.loan_id || null
      ]
    );
    return res.rows[0] ? Number(res.rows[0].id) : null;
  } catch (error) {
    console.error("Error in createTransaction:", error);
    return null;
  }
}

export async function getTransactionsIdsBySubjectId(subjectId: number): Promise<{ id: number }[]> {
  try {
    const res = await pool.query(
      "SELECT id FROM public.transactions WHERE subject_id = $1 AND deleted_at IS NULL;",
      [subjectId]
    );
    return res.rows.map(row => ({ id: Number(row.id) }));
  } catch (error) {
    console.error(`Error in getTransactionsIdsBySubjectId for subject ${subjectId}:`, error);
    return [];
  }
}

export async function getTransactionById(id: number): Promise<TransactionT | null> {
  try {
    const res: QueryResult<TransactionRow> = await pool.query(
      `${BASE_TRANSACTION_QUERY} WHERE t.id = $1 AND t.deleted_at IS NULL LIMIT 1;`,
      [id]
    );
    return res.rows[0] ? mapRowToTransaction(res.rows[0]) : null;
  } catch (error) {
    console.error(`Error in getTransactionById ${id}:`, error);
    return null;
  }
}

export async function getTransactionAmount(id: number): Promise<number> {
  try {
    const res = await pool.query(
      "SELECT amount FROM public.transactions WHERE id = $1 AND deleted_at IS NULL LIMIT 1;",
      [id]
    );
    return res.rows[0] ? Number(res.rows[0].amount) : 0;
  } catch (error) {
    console.error(`Error in getTransactionAmount ${id}:`, error);
    return 0;
  }
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
  id: number
): Promise<boolean> {
  try {
    const res = await pool.query(
      `UPDATE public.transactions SET 
        date = $1, amount = $2, description = $3, category_id = $4, subject_id = $5, 
        important = $6, method_id = $7, transaction_type_id = $8, updated_at = NOW() 
      WHERE id = $9 AND deleted_at IS NULL;`,
      [date, amount, description, categoryId, subjectId, important, methodId, transactionTypeId, id]
    );
    return (res.rowCount ?? 0) > 0;
  } catch (error) {
    console.error(`Error in editTransaction ${id}:`, error);
    return false;
  }
}

export async function deleteTransaction(transactionId: number): Promise<boolean> {
  try {
    const res = await pool.query(
      `UPDATE public.transactions SET deleted_at = NOW() WHERE id = $1 AND deleted_at IS NULL;`,
      [transactionId]
    );
    return (res.rowCount ?? 0) > 0;
  } catch (error) {
    console.error(`Error in deleteTransaction ${transactionId}:`, error);
    return false;
  }
}

function mapRowToTransaction(row: TransactionRow): TransactionT {
  return {
    id: Number(row.id),
    date: new Date(row.date),
    amount: Number(row.amount),
    description: row.description,
    super_category_id: Number(row.super_category_id),
    super_category_name: row.super_category_name,
    category_id: Number(row.category_id),
    category_name: row.category_name,
    subject_id: Number(row.subject_id),
    subject_name: row.subject_name,
    income: Boolean(row.income),
    important: Boolean(row.important),
    user_id: Number(row.user_id),
    wallet_id: Number(row.wallet_id),
    method_id: Number(row.method_id),
    method_name: row.method_name,
    transaction_type_id: Number(row.transaction_type_id),
    loan_id: row.loan_id ? Number(row.loan_id) : null,
    updated_at: new Date(row.updated_at),
    deleted_at: row.deleted_at ? new Date(row.deleted_at) : null,
  };
}
