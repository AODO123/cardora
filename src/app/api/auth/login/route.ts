import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { verifyPassword, signSessionToken } from "@/lib/auth";

export async function POST(req: Request) {
  try {
    const { email, password } = await req.json();

    if (!email || !password) {
      return NextResponse.json({ error: "Email and password are required." }, { status: 400 });
    }

    const user = await db.user.findUnique({ where: { email: email.toLowerCase() } });
    if (!user) {
      return NextResponse.json({ error: "Invalid email or password." }, { status: 401 });
    }

    const isValid = await verifyPassword(password, user.passwordHash);
    if (!isValid) {
      return NextResponse.json({ error: "Invalid email or password." }, { status: 401 });
    }

    const token = await signSessionToken({ userId: user.id, role: user.role, email: user.email });

    const response = NextResponse.json({
      success: true,
      user: { id: user.id, name: user.name, email: user.email, plan: user.plan, role: user.role },
    });

    response.cookies.set("cardora_session", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 60 * 60 * 24 * 7,
      path: "/",
    });

    return response;
  } catch (err: any) {
    return NextResponse.json({ error: err.message || "Failed to log in" }, { status: 500 });
  }
}
