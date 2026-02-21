import { NextResponse } from "next/server";
import { createLoan } from "@app/utils/db-actions/loan";
import { verifySession } from "@app/utils/session";

export async function POST(request: Request) {
    const session = await verifySession();
    if (!session.isAuth) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const data = await request.json();
    try {
        const loanId = await createLoan(session.userId, {
            ...data,
            date: new Date(data.date),
        });
        return NextResponse.json({ id: loanId });
    } catch (err) {
        console.error("Failed to create loan", err);
        return NextResponse.json({ error: "Failed to create loan" }, { status: 500 });
    }
}
