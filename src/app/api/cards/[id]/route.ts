import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth";
import { db } from "@/lib/db";

export async function GET(req: Request, { params }: { params: { id: string } }) {
  const user = await getCurrentUser();
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const card = await db.card.findUnique({
    where: { id: params.id },
  });

  if (!card) {
    return NextResponse.json({ error: "Card not found" }, { status: 404 });
  }

  if (card.userId !== user.id) {
    return NextResponse.json({ error: "Forbidden. Card not found or not owned by user." }, { status: 403 });
  }

  return NextResponse.json({ card });
}

export async function PUT(req: Request, { params }: { params: { id: string } }) {
  const user = await getCurrentUser();
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const existing = await db.card.findUnique({ where: { id: params.id } });
  if (!existing || existing.userId !== user.id) {
    return NextResponse.json({ error: "Forbidden. Card not found or not owned by user." }, { status: 403 });
  }

  try {
    const data = await req.json();

    const card = await db.card.update({
      where: { id: params.id },
      data: {
        name: data.name,
        photoData: data.photoData,
        country: data.country,
        status: data.status,
        title: data.title,
        bio: data.bio,
        instagram: data.instagram,
        discord: data.discord,
        linkedin: data.linkedin,
        tiktok: data.tiktok,
        website: data.website,
        mbti: data.mbti,
        interests: data.interests,
        favoriteSong: data.favoriteSong,
        favoriteMovie: data.favoriteMovie,
        theme: data.theme,
        primaryColor: data.primaryColor,
      },
    });

    return NextResponse.json({ success: true, card });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || "Failed to update card" }, { status: 500 });
  }
}

export async function DELETE(req: Request, { params }: { params: { id: string } }) {
  const user = await getCurrentUser();
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const existing = await db.card.findUnique({ where: { id: params.id } });
  if (!existing || existing.userId !== user.id) {
    return NextResponse.json({ error: "Forbidden. Card not found or not owned by user." }, { status: 403 });
  }

  await db.card.delete({ where: { id: params.id } });

  return NextResponse.json({ success: true });
}
