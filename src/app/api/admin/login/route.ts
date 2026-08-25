import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { verifyPassword, signSessionToken } from "@/lib/auth";

export async function POST(req: Request) {
  try {
    const { email, password } = await req.json();

    if (!email || !password) {
      return NextResponse.json({ error: "Admin email and password are required." }, { status: 400 });
    }

    const adminUser = await db.user.findFirst({
      where: {
        email: email.toLowerCase(),
        role: "ADMIN",
      },
    });

    if (!adminUser) {
      return NextResponse.json({ error: "Invalid admin credentials." }, { status: 401 });
    }

    const isValid = await verifyPassword(password, adminUser.passwordHash);
    if (!isValid) {
      return NextResponse.json({ error: "Invalid admin credentials." }, { status: 401 });
    }

    const token = await signSessionToken({
      userId: adminUser.id,
      role: adminUser.role,
      email: adminUser.email,
    });

    const response = NextResponse.json({
      success: true,
      admin: { id: adminUser.id, email: adminUser.email, name: adminUser.name },
    });

    response.cookies.set("cardora_admin_session", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 60 * 60 * 24, // 24 hours
      path: "/",
    });

    return response;
  } catch (err: any) {
    return NextResponse.json({ error: err.message || "Admin login failed" }, { status: 500 });
  }
}
