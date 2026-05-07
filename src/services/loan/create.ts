"use server";

import { createLoan } from "@utils/db-actions/loan";
import { verifySession } from "@utils/session";

export async function createLoanAction(data: any) {
    const session = await verifySession();
    if (!session.isAuth) {
        throw new Error("Unauthorized");
    }

    try {
        const { userId, ...loanData } = data;
        const targetUserId = userId || session.userId;

        if (loanData.date) {
            loanData.date = new Date(loanData.date);
        }

        const loanId = await createLoan(targetUserId, loanData);
        return { success: true, loanId };
    } catch (e) {
        console.error("Error creating loan:", e);
        throw new Error("Failed to create loan");
    }
}
