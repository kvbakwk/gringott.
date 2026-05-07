"use server";

import { updateLoan } from "@utils/db-actions/loan";
import { verifySession } from "@utils/session";

export async function editLoanAction(loanId: number, data: any) {
    const session = await verifySession();
    if (!session.isAuth) {
        throw new Error("Unauthorized");
    }

    try {
        await updateLoan(session.userId, loanId, data);
        return { success: true };
    } catch (err) {
        console.error("Failed to edit loan", err);
        throw new Error("Failed to edit loan");
    }
}
