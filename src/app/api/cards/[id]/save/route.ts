import { NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function POST(req: Request, { params }: { params: { id: string } }) {
  try {
    await db.card.update({
      where: { id: params.id },
      data: { saves: { increment: 1 } },
    });
    return NextResponse.json({ success: true });
  } catch (err: any) {
    return NextResponse.json({ error: "Failed to increment saves" }, { status: 500 });
  }
}
