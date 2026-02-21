import { NextResponse } from "next/server";
import { updateLoan } from "@app/utils/db-actions/loan";
import { verifySession } from "@app/utils/session";

export async function POST(request: Request) {
    const session = await verifySession();
    if (!session.isAuth) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const data = await request.json();
    try {
        await updateLoan(session.userId, data.loanId, data);
        return NextResponse.json({ success: true });
    } catch (err) {
        console.error("Failed to edit loan", err);
        return NextResponse.json({ error: "Failed to edit loan" }, { status: 500 });
    }
}
