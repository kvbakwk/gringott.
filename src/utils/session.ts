import "server-only";
import { jwtVerify, SignJWT } from "jose";
import { cookies } from "next/headers";
import { SessionPayload } from "./definitions";
import { redirect } from "next/navigation";
import { cache } from "react";
import { RouteSegments } from "./routes";

const secretKey = process.env.SESSION_SECRET;
const encodedKey = new TextEncoder().encode(secretKey);

export async function createSession(userId: number) {
  const accessExpiresAt = new Date(Date.now() + 15 * 60 * 1000); // 15 mins
  const refreshExpiresAt = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000); // 30 days

  const accessToken = await encrypt({ userId, type: "access", expiresAt: accessExpiresAt });
  const refreshToken = await encrypt({ userId, type: "refresh", expiresAt: refreshExpiresAt });

  const cookieStore = await cookies();

  cookieStore.set("session", accessToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    expires: accessExpiresAt,
    sameSite: "lax",
    path: "/",
  });

  cookieStore.set("refresh_token", refreshToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    expires: refreshExpiresAt,
    sameSite: "lax",
    path: "/",
  });
}

export async function issueNewAccessToken(userId: number) {
  const accessExpiresAt = new Date(Date.now() + 15 * 60 * 1000); // 15 mins
  const newAccessToken = await encrypt({ userId, type: "access", expiresAt: accessExpiresAt });
  
  return { newAccessToken, accessExpiresAt };
}

export async function deleteSession() {
  const cookieStore = await cookies();
  cookieStore.delete("session");
  cookieStore.delete("refresh_token");
}

export const verifySession = cache(
  async (): Promise<{ isAuth: boolean; userId?: number }> => {
    const cookieStore = await cookies();
    const sessionCookie = cookieStore.get("session")?.value;
    const refreshCookie = cookieStore.get("refresh_token")?.value;

    if (!sessionCookie && !refreshCookie) return { isAuth: false };

    let session = await decrypt(sessionCookie);

    // If access token is invalid/expired but refresh token exists, 
    // we let the middleware handle the cookie update, but here we can 
    // at least verify the refresh token to authorize the current request.
    if ((!session || session.type !== "access") && refreshCookie) {
      const refreshPayload = await decrypt(refreshCookie);
      if (refreshPayload && refreshPayload.type === "refresh") {
        session = refreshPayload;
      }
    }

    if (!session?.userId) {
      return { isAuth: false };
    }

    return { isAuth: true, userId: parseInt(session.userId.toString()) };
  }
);

export async function encrypt(payload: SessionPayload) {
  return new SignJWT(payload)
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime(payload.expiresAt)
    .sign(encodedKey);
}
export async function decrypt(session: string | undefined): Promise<SessionPayload | null> {
  if (!session) return null;

  try {
    const { payload } = await jwtVerify(session, encodedKey, {
      algorithms: ["HS256"],
    });
    return payload as SessionPayload;
  } catch (error) {
    return null;
  }
}
