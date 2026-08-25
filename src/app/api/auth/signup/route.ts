import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { hashPassword, signSessionToken } from "@/lib/auth";

export async function POST(req: Request) {
  try {
    const { name, email, password } = await req.json();

    if (!name || !email || !password) {
      return NextResponse.json({ error: "Name, email, and password are required." }, { status: 400 });
    }

    const existingUser = await db.user.findUnique({ where: { email: email.toLowerCase() } });
    if (existingUser) {
      return NextResponse.json({ error: "Email address is already registered." }, { status: 409 });
    }

    const passwordHash = await hashPassword(password);
    const user = await db.user.create({
      data: {
        name,
        email: email.toLowerCase(),
        passwordHash,
        plan: "FREE",
        role: "USER",
      },
    });

    const token = await signSessionToken({ userId: user.id, role: user.role, email: user.email });

    const response = NextResponse.json({
      success: true,
      user: { id: user.id, name: user.name, email: user.email, plan: user.plan, role: user.role },
    });

    response.cookies.set("cardora_session", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 60 * 60 * 24 * 7, // 7 days
      path: "/",
    });

    return response;
  } catch (err: any) {
    return NextResponse.json({ error: err.message || "Failed to register" }, { status: 500 });
  }
}
