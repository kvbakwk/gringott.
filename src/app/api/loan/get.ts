"use server";

import { LoanT, getLoansByUserId } from "@app/utils/db-actions/loan";
import { verifySession } from "@app/utils/session";

export async function getLoans(
    userId: number,
    since?: Date
): Promise<LoanT[]> {
    if (!(await verifySession()).isAuth) return [];
    return await getLoansByUserId(userId, since);
}
