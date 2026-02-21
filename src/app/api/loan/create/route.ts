
import { NextRequest, NextResponse } from "next/server";
import { createLoan } from "@app/utils/db-actions/loan";

export const dynamic = 'force-dynamic';

export async function POST(req: NextRequest) {
    try {
        const body = await req.json();
        const { userId, ...data } = body;

        // Ensure date is a Date object
        if (data.date) {
            data.date = new Date(data.date);
        }

        const loanId = await createLoan(userId, data);

        return NextResponse.json({ success: true, loanId });
    } catch (e) {
        console.error("Error creating loan:", e);
        return NextResponse.json({ error: "Failed to create loan" }, { status: 500 });
    }
}
