"use server";

import { repayLoan } from "@utils/db-actions/loan";
import { verifySession } from "@utils/session";

export async function payLoanAction(data: {
  loanId: number;
  amount: number;
  description: string;
  walletId: number;
  date?: string | Date;
}) {
    const session = await verifySession();
    if (!session.isAuth) {
        throw new Error("Unauthorized");
    }

    console.log("Repay Request Data:", { userId: session.userId, ...data });
    try {
        await repayLoan(
            session.userId,
            data.loanId,
            data.amount,
            data.description,
            data.walletId,
            data.date ? new Date(data.date) : new Date()
        );
        return { success: true };
    } catch (err) {
        console.error("Failed to repay loan", err);
        throw new Error("Failed to repay loan");
    }
}
