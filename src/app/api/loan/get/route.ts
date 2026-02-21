import { NextResponse } from "next/server";
import { getLoansByUserId } from "@app/utils/db-actions/loan";
import { verifySession } from "@app/utils/session";

export async function GET() {
    const session = await verifySession();
    if (!session.isAuth) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const loans = await getLoansByUserId(session.userId);
    return NextResponse.json(loans);
}
