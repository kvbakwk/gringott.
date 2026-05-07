"use server";

import { getLoansByUserId } from "@utils/db-actions/loan";
import { verifySession } from "@utils/session";

export async function getLoansAction() {
    const session = await verifySession();
    if (!session.isAuth) {
        throw new Error("Unauthorized");
    }

    return await getLoansByUserId(session.userId);
}
