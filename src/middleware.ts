import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";
import { decrypt, issueNewAccessToken } from "@utils/session";

const protectedRoutes = ["/"];
const publicRoutes = ["/logowanie", "/rejestracja"];

export default async function middleware(req: NextRequest) {
  const path = req.nextUrl.pathname;
  const isProtectedRoute = protectedRoutes.includes(path);
  const isPublicRoute = publicRoutes.includes(path);

  const sessionCookie = req.cookies.get("session")?.value;
  const refreshCookie = req.cookies.get("refresh_token")?.value;

  let session = await decrypt(sessionCookie);
  let justRefreshed = false;

  // If access token is missing or expired, but we have a refresh token
  if ((!session || session.type !== "access") && refreshCookie) {
    const refreshPayload = await decrypt(refreshCookie);
    if (refreshPayload && refreshPayload.type === "refresh") {
      // Refresh token is valid, so user is authenticated
      session = refreshPayload;
      justRefreshed = true;
    }
  }
  
  if (isProtectedRoute && !session?.userId) {
    return NextResponse.redirect(new URL("/logowanie", req.nextUrl));
  }

  let res = NextResponse.next();

  if (isPublicRoute && session?.userId) {
    res = NextResponse.redirect(new URL("/", req.nextUrl));
  }

  if (justRefreshed && session?.userId) {
    const { newAccessToken, accessExpiresAt } = await issueNewAccessToken(Number(session.userId));
    res.cookies.set({
      name: "session",
      value: newAccessToken,
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      expires: accessExpiresAt,
      sameSite: "lax",
      path: "/",
    });
  }

  return res;
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|webp|gif)$).*)"]
};
