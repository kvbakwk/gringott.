import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";
import { decrypt } from "./app/utils/session";

const protectedRoutes = ["/"];
const publicRoutes = ["/logowanie", "/rejestracja"];

export default async function middleware(req: NextRequest) {
  const path = req.nextUrl.pathname;
  const isProtectedRoute = protectedRoutes.includes(path);
  const isPublicRoute = publicRoutes.includes(path);

  const cookie = (await cookies()).get("session")?.value;
  const session = await decrypt(cookie);

  if (isProtectedRoute && !session?.userId)
    return NextResponse.redirect(new URL("/logowanie", req.nextUrl));

  if (isPublicRoute && session?.userId)
    return NextResponse.redirect(new URL("/", req.nextUrl));

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|.*\\.png$).*)"],
};
