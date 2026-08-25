import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth";
import { db } from "@/lib/db";

export async function POST(req: Request) {
  const user = await getCurrentUser();
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { plan } = await req.json();
    const newPlan = plan === "PAID" ? "PAID" : "FREE";

    const updatedUser = await db.user.update({
      where: { id: user.id },
      data: { plan: newPlan },
    });

    return NextResponse.json({ success: true, plan: updatedUser.plan });
  } catch (err: any) {
    return NextResponse.json({ error: "Failed to update plan" }, { status: 500 });
  }
}
