import { NextResponse } from "next/server";
import { repayLoan } from "@app/utils/db-actions/loan";
import { verifySession } from "@app/utils/session";

export async function POST(request: Request) {
    const session = await verifySession();
    if (!session.isAuth) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const data = await request.json();
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
        return NextResponse.json({ success: true });
    } catch (err) {
        console.error("Failed to repay loan", err);
        return NextResponse.json({ error: "Failed to repay loan" }, { status: 500 });
    }
}
