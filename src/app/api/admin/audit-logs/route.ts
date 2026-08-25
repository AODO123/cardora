import { NextResponse } from "next/server";
import { getAdminUser } from "@/lib/auth";
import { db } from "@/lib/db";

export async function GET() {
  const admin = await getAdminUser();
  if (!admin) {
    return NextResponse.json({ error: "Unauthorized admin access." }, { status: 401 });
  }

  const logs = await db.auditLog.findMany({
    include: {
      admin: {
        select: { id: true, name: true, email: true },
      },
    },
    orderBy: { createdAt: "desc" },
    take: 50,
  });

  return NextResponse.json({ logs });
}
