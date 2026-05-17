"use server";

import { QueryResult } from "pg";
import pool from "@/utils/db";
import { LoanT, LoanStatus } from "@/types/loan";

interface LoanRow {
  id: string | number;
  user_id: string | number;
  subject_id: string | number;
  name: string | null;
  total_amount: string | number;
  paid_amount: string | number;
  is_given: boolean;
  currency: string;
  status: string;
  created_at: string | Date;
  updated_at: string | Date;
  deleted_at: string | Date | null;
}

export async function getLoansByUserId(
  userId: number,
  since?: Date,
): Promise<LoanT[]> {
  try {
    const query = since
      ? `SELECT * FROM public.loans WHERE user_id = $1 AND updated_at > $2 ORDER BY created_at DESC`
      : `SELECT * FROM public.loans WHERE user_id = $1 AND deleted_at IS NULL ORDER BY created_at DESC`;

    const params = since ? [userId, since] : [userId];
    const { rows }: QueryResult<LoanRow> = await pool.query(query, params);

    return rows.map(mapRowToLoan);
  } catch (error) {
    console.error(`Error in getLoansByUserId for user ${userId}:`, error);
    return [];
  }
}

export async function createLoan(
  userId: number,
  data: {
    subject_id: number;
    name: string;
    total_amount: number;
    is_given: boolean;
    date: Date;
  },
): Promise<number | null> {
  const client = await pool.connect();
  try {
    await client.query("BEGIN");

    const { rows: loanRows }: QueryResult<{ id: number }> = await client.query(
      `INSERT INTO public.loans (user_id, subject_id, name, total_amount, is_given) 
             VALUES ($1, $2, $3, $4, $5) RETURNING id`,
      [userId, data.subject_id, data.name, data.total_amount, data.is_given],
    );

    const loanId = loanRows[0]?.id;
    if (!loanId) throw new Error("Failed to retrieve new loan ID");

    await client.query("COMMIT");
    return Number(loanId);
  } catch (error) {
    await client.query("ROLLBACK");
    console.error("Error in createLoan:", error);
    return null;
  } finally {
    client.release();
  }
}

export async function updateLoan(
  userId: number,
  loanId: number,
  data: Partial<LoanT>,
): Promise<LoanT | null> {
  try {
    const { rows }: QueryResult<LoanRow> = await pool.query(
      `UPDATE public.loans SET name = COALESCE($1, name), total_amount = COALESCE($2, total_amount), 
             status = COALESCE($3, status) 
             WHERE id = $4 AND user_id = $5 AND deleted_at IS NULL RETURNING *`,
      [
        data.name,
        data.total_amount,
        data.status,
        Number(loanId),
        Number(userId),
      ],
    );
    return rows[0] ? mapRowToLoan(rows[0]) : null;
  } catch (error) {
    console.error(`Error in updateLoan for loan ${loanId}:`, error);
    return null;
  }
}

export async function deleteLoan(
  userId: number,
  loanId: number,
): Promise<boolean> {
  try {
    const res = await pool.query(
      `UPDATE public.loans SET deleted_at = NOW() WHERE id = $1 AND user_id = $2 AND deleted_at IS NULL`,
      [Number(loanId), Number(userId)],
    );
    return (res.rowCount ?? 0) > 0;
  } catch (error) {
    console.error(`Error in deleteLoan for loan ${loanId}:`, error);
    return false;
  }
}

export async function repayLoan(
  userId: number,
  loanId: number,
  amount: number,
  description: string,
  walletId: number,
  date: Date = new Date(),
): Promise<boolean> {
  const client = await pool.connect();
  try {
    await client.query("BEGIN");

    const { rows: loanRows }: QueryResult<LoanRow> = await client.query(
      `SELECT * FROM public.loans WHERE id = $1 AND user_id = $2 AND deleted_at IS NULL`,
      [Number(loanId), Number(userId)],
    );

    if (loanRows.length === 0) {
      throw new Error("Loan not found");
    }
    const loan = mapRowToLoan(loanRows[0]);

    const subjectId = loan.subject_id;
    const isIncome = loan.is_given;

    // Find appropriate Category
    let categoryId = null;
    const { rows: categoryRows } = await client.query(
      `SELECT id FROM public.categories WHERE (name ILIKE 'Należności' OR name ILIKE 'Długi' OR name ILIKE 'Spłata') AND deleted_at IS NULL LIMIT 1`,
    );
    categoryId = categoryRows.length > 0 ? categoryRows[0].id : null;

    if (!categoryId) {
      const { rows: fallbackRows } = await client.query(
        `SELECT c.id FROM public.categories c 
                 JOIN public.super_categories sc ON c.super_category_id = sc.id 
                 WHERE ${isIncome ? "sc.income = true" : "sc.outcome = true"} 
                 AND c.deleted_at IS NULL AND sc.deleted_at IS NULL 
                 LIMIT 1`,
      );
      if (fallbackRows.length > 0) categoryId = fallbackRows[0].id;
    }

    if (!categoryId)
      throw new Error("No suitable category found for repayment transaction");

    const { rows: methodRows } = await client.query(
      `SELECT id FROM public.methods WHERE deleted_at IS NULL LIMIT 1`,
    );
    if (methodRows.length === 0) throw new Error("No payment method found");
    const methodId = methodRows[0].id;

    const transactionTypeId = 1;

    await client.query(
      `INSERT INTO public.transactions 
              (date, amount, description, category_id, subject_id, income, important, user_id, wallet_id, method_id, transaction_type_id, loan_id)
             VALUES 
              ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12)`,
      [
        date,
        amount,
        description ||
          (loan.is_given
            ? "spłata pożyczki (wpływ)"
            : "spłata pożyczki (wydatek)"),
        categoryId,
        subjectId,
        isIncome,
        false,
        userId,
        walletId,
        methodId,
        transactionTypeId,
        loanId,
      ],
    );

    await client.query("COMMIT");
    return true;
  } catch (error) {
    await client.query("ROLLBACK");
    console.error(`Error in repayLoan for loan ${loanId}:`, error);
    return false;
  } finally {
    client.release();
  }
}

function mapRowToLoan(row: LoanRow): LoanT {
  return {
    id: Number(row.id),
    user_id: Number(row.user_id),
    subject_id: Number(row.subject_id),
    name: row.name,
    total_amount: Number(row.total_amount),
    paid_amount: Number(row.paid_amount),
    is_given: row.is_given,
    currency: row.currency,
    status: row.status as LoanStatus,
    created_at: new Date(row.created_at),
    updated_at: new Date(row.updated_at),
    deleted_at: row.deleted_at ? new Date(row.deleted_at) : null,
  };
}
