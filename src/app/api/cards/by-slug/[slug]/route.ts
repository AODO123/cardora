import { NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function GET(req: Request, { params }: { params: { slug: string } }) {
  try {
    const card = await db.card.findUnique({
      where: { slug: params.slug },
    });

    if (!card) {
      return NextResponse.json({ error: "Card not found" }, { status: 404 });
    }

    // Increment view counter
    await db.card.update({
      where: { id: card.id },
      data: { views: { increment: 1 } },
    });

    return NextResponse.json({ card: { ...card, views: card.views + 1 } });
  } catch (err: any) {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
