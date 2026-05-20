import { NextResponse } from "next/server";
import { getServerSessionUser } from "@/lib/auth/session-server";

export async function GET() {
  const user = await getServerSessionUser();
  if (!user) {
    return NextResponse.json({ user: null }, { status: 401 });
  }
  return NextResponse.json({
    user: {
      _id: user._id,
      email: user.email,
      name: user.name,
      role: user.role,
      staffId: user.staffId ?? null,
    },
  });
}
