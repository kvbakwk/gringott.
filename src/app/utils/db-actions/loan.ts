
import pool from "../db";

export type LoanT = {
    id: number;
    user_id: number;
    subject_id: number;
    name: string | null;
    total_amount: number;
    paid_amount: number;
    is_given: boolean;
    currency: string;
    status: 'active' | 'paid';
    created_at: Date;
    updated_at: Date;
    deleted_at: Date | null;
};

export async function getLoansByUserId(userId: number, since?: Date) {
    const client = await pool.connect();
    try {
        const query = since
            ? `SELECT * FROM public.loan WHERE user_id = $1 AND updated_at > $2 ORDER BY created_at DESC`
            : `SELECT * FROM public.loan WHERE user_id = $1 AND deleted_at IS NULL ORDER BY created_at DESC`;

        const params = since ? [userId, since] : [userId];

        const { rows } = await client.query(query, params);

        return rows.map(row => ({
            ...row,
            total_amount: parseFloat(row.total_amount),
            paid_amount: parseFloat(row.paid_amount),
            created_at: new Date(row.created_at),
            updated_at: new Date(row.updated_at),
            deleted_at: row.deleted_at ? new Date(row.deleted_at) : null
        }));
    } finally {
        client.release();
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
    }
) {
    const client = await pool.connect();
    try {
        await client.query("BEGIN");

        const { rows: loanRows } = await client.query(
            `INSERT INTO public.loan (user_id, subject_id, name, total_amount, is_given) 
             VALUES ($1, $2, $3, $4, $5) RETURNING id`,
            [userId, data.subject_id, data.name, data.total_amount, data.is_given]
        );
        const loanId = loanRows[0].id;

        // Create initial transaction
        // If given (I lend money), it's an outcome (expense) for me.
        // If received (I borrow money), it's an income for me.
        const isIncome = !data.is_given;

        // Find or create appropriate category/method?
        // For simplicity, we might need a default category for loans if not provided.
        // Or we just assume the user handles it manually?
        // The prompt says "add loan... add repayment".
        // Let's assume creating a loan optionally creates a transaction.
        // But for now, let's just create the loan record. The user can add transaction separately or we can automate.
        // The implementation plan said: "Creating a loan will also optionally create an initial transaction".

        // For now, let's just return the loan ID and handle transaction creation in the route if needed.

        await client.query("COMMIT");
        return loanId;
    } catch (e) {
        await client.query("ROLLBACK");
        throw e;
    } finally {
        client.release();
    }
}

export async function updateLoan(userId: number, loanId: number, data: Partial<LoanT>) {
    const client = await pool.connect();
    try {
        const { rows } = await client.query(
            `UPDATE public.loan SET name = COALESCE($1, name), total_amount = COALESCE($2, total_amount), 
             status = COALESCE($3, status), updated_at = NOW() 
             WHERE id = $4 AND user_id = $5 RETURNING *`,
            [data.name, data.total_amount, data.status, Number(loanId), Number(userId)]
        );
        return rows[0];
    } finally {
        client.release();
    }
}

export async function deleteLoan(userId: number, loanId: number) {
    const client = await pool.connect();
    try {
        await client.query(
            `UPDATE public.loan SET deleted_at = NOW(), updated_at = NOW() WHERE id = $1 AND user_id = $2`,
            [Number(loanId), Number(userId)]
        );
    } finally {
        client.release();
    }
}

export async function repayLoan(
    userId: number,
    loanId: number,
    amount: number,
    description: string,
    walletId: number,
    date: Date = new Date()
) {
    const client = await pool.connect();
    try {
        await client.query("BEGIN");

        // Fetch current loan to ensure it exists and belongs to user
        console.log(`repayLoan: checking loan id=${loanId}, userId=${userId}`);
        const { rows: loanRows } = await client.query(
            `SELECT * FROM public.loan WHERE id = $1 AND user_id = $2`,
            [Number(loanId), Number(userId)]
        );
        if (loanRows.length === 0) {
            console.error(`repayLoan: Loan not found for id=${loanId}, userId=${userId}`);
            throw new Error("Loan not found");
        }
        const loan = loanRows[0];

        // 1. Get Subject
        const subjectId = loan.subject_id;

        // 2. Get Transaction Type (Expense/Income)
        // loan.is_given = true => I gave money. Repayment = I get money back => Income = true.
        // loan.is_given = false => I took money. Repayment = I pay back => Income = false.
        const isIncome = loan.is_given;

        // 3. Find appropriate Category
        let categoryId = null;
        // Try to find a category named "Należności" or similar
        const { rows: categoryRows } = await client.query(
            `SELECT id FROM public.category WHERE name ILIKE 'Należności' OR name ILIKE 'Długi' OR name ILIKE 'Spłata' LIMIT 1`
        );
        categoryId = categoryRows.length > 0 ? categoryRows[0].id : null;

        if (!categoryId) {
            // Fallback: get first allowable category for this direction (income/expense)
            const { rows: fallbackRows } = await client.query(
                `SELECT c.id FROM public.category c 
                 JOIN public.super_category sc ON c.super_category_id = sc.id 
                 WHERE ${isIncome ? 'sc.income = true' : 'sc.outcome = true'} 
                 LIMIT 1`
            );
            if (fallbackRows.length > 0) categoryId = fallbackRows[0].id;
        }

        if (!categoryId) throw new Error("No suitable category found for repayment transaction");

        // 4. Find Method for the Wallet
        // We assume the wallet has a preferred method or we pick a default 'Bank'/'Cash' method.
        // For simplicity, we'll pick the first available method.
        const { rows: methodRows } = await client.query(`SELECT id FROM public.method LIMIT 1`);
        if (methodRows.length === 0) throw new Error("No payment method found");
        const methodId = methodRows[0].id;

        // 5. Transaction Type ID (Default 1)
        const transactionTypeId = 1;

        await client.query(
            `INSERT INTO public.transaction 
              (date, amount, description, category_id, subject_id, income, important, user_id, wallet_id, method_id, transaction_type_id, loan_id)
             VALUES 
              ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12)`,
            [
                date,
                amount,
                description || (loan.is_given ? "spłata pożyczki (wpływ)" : "spłata pożyczki (wydatek)"),
                categoryId,
                subjectId,
                isIncome,
                false, // important
                userId,
                walletId,
                methodId,
                transactionTypeId,
                loanId
            ]
        );

        await client.query("COMMIT");
    } catch (e) {
        await client.query("ROLLBACK");
        throw e;
    } finally {
        client.release();
    }
}
