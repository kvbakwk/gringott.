import { NextResponse } from "next/server";
import { deleteLoan } from "@app/utils/db-actions/loan";
import { verifySession } from "@app/utils/session";

export async function POST(request: Request) {
    const session = await verifySession();
    if (!session.isAuth) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const data = await request.json();
    try {
        await deleteLoan(session.userId, data.loanId);
        return NextResponse.json({ success: true });
    } catch (err) {
        console.error("Failed to delete loan", err);
        return NextResponse.json({ error: "Failed to delete loan" }, { status: 500 });
    }
}
