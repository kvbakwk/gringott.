"use server";

import { deleteLoan } from "@utils/db-actions/loan";
import { verifySession } from "@utils/session";

export async function deleteLoanAction(loanId: number) {
    const session = await verifySession();
    if (!session.isAuth) {
        throw new Error("Unauthorized");
    }

    try {
        await deleteLoan(session.userId, loanId);
        return { success: true };
    } catch (err) {
        console.error("Failed to delete loan", err);
        throw new Error("Failed to delete loan");
    }
}
