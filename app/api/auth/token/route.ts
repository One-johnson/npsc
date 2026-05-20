import { NextResponse } from "next/server";
import { getServerSessionUser, getSessionTokenFromCookies } from "@/lib/auth/session-server";

/** Returns session token + user for Convex client auth (token stays in memory on client). */
export async function GET() {
  const token = await getSessionTokenFromCookies();
  if (!token) {
    return NextResponse.json({ token: null, user: null });
  }

  const user = await getServerSessionUser();
  if (!user) {
    return NextResponse.json({ token: null, user: null });
  }

  return NextResponse.json({
    token,
    user: {
      _id: user._id,
      email: user.email,
      name: user.name,
      role: user.role,
      staffId: user.staffId ?? null,
    },
  });
}
