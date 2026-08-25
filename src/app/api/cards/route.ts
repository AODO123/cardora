import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth";
import { db } from "@/lib/db";

export async function GET() {
  const user = await getCurrentUser();
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const cards = await db.card.findMany({
    where: { userId: user.id },
    orderBy: { createdAt: "desc" },
  });

  return NextResponse.json({ cards, plan: user.plan });
}

export async function POST(req: Request) {
  const user = await getCurrentUser();
  if (!user) {
    return NextResponse.json({ error: "Unauthorized. Please log in first." }, { status: 401 });
  }

  const userCardsCount = await db.card.count({ where: { userId: user.id } });

  // Free tier rule: 1 card max
  if (user.plan === "FREE" && userCardsCount >= 1) {
    return NextResponse.json(
      {
        error: "Free tier accounts are limited to 1 card. Upgrade to Pro ($5/mo) for unlimited cards!",
        limitReached: true,
      },
      { status: 403 }
    );
  }

  try {
    const data = await req.json();

    // Generate unique slug
    let rawSlug = (data.slug || data.name || "card")
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-|-$/g, "");
    if (!rawSlug) rawSlug = "card";

    let slug = rawSlug;
    let counter = 1;
    while (await db.card.findUnique({ where: { slug } })) {
      slug = `${rawSlug}-${counter++}`;
    }

    const card = await db.card.create({
      data: {
        userId: user.id,
        slug,
        name: data.name || "Untitled Card",
        photoUrl: data.photoUrl || null,
        country: data.country || "United States",
        status: data.status || "Professional",
        title: data.title || "Title",
        bio: data.bio || "",
        instagram: data.instagram || null,
        discord: data.discord || null,
        linkedin: data.linkedin || null,
        tiktok: data.tiktok || null,
        website: data.website || null,
        mbti: data.mbti || null,
        interests: data.interests || null,
        favoriteSong: data.favoriteSong || null,
        favoriteMovie: data.favoriteMovie || null,
        theme: data.theme || "sunset-gradient",
        primaryColor: data.primaryColor || "#f43f5e",
      },
    });

    return NextResponse.json({ success: true, card });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || "Failed to create card" }, { status: 500 });
  }
}
