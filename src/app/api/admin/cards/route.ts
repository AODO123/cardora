import { NextResponse } from "next/server";
import { getAdminUser } from "@/lib/auth";
import { db } from "@/lib/db";

export async function GET() {
  const admin = await getAdminUser();
  if (!admin) {
    return NextResponse.json({ error: "Unauthorized admin access." }, { status: 401 });
  }

  const cards = await db.card.findMany({
    include: {
      user: {
        select: { id: true, name: true, email: true, plan: true },
      },
    },
    orderBy: { createdAt: "desc" },
  });

  const totalUsers = await db.user.count();
  const totalCards = cards.length;
  const totalViews = cards.reduce((acc, c) => acc + c.views, 0);
  const totalSaves = cards.reduce((acc, c) => acc + c.saves, 0);

  return NextResponse.json({
    admin,
    cards,
    stats: { totalUsers, totalCards, totalViews, totalSaves },
  });
}
