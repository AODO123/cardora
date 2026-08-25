import { NextResponse } from "next/server";
import { getAdminUser } from "@/lib/auth";
import { db } from "@/lib/db";

export async function PUT(req: Request, { params }: { params: { id: string } }) {
  const admin = await getAdminUser();
  if (!admin) {
    return NextResponse.json({ error: "Unauthorized admin access." }, { status: 401 });
  }

  const existingCard = await db.card.findUnique({ where: { id: params.id } });
  if (!existingCard) {
    return NextResponse.json({ error: "Card not found." }, { status: 404 });
  }

  try {
    const data = await req.json();

    const updatedCard = await db.card.update({
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
      },
    });

    // Create Audit Log
    await db.auditLog.create({
      data: {
        adminId: admin.id,
        action: "EDIT_CARD",
        targetCardId: params.id,
        targetUserId: existingCard.userId,
        details: `Admin ${admin.name} (${admin.email}) modified card "${updatedCard.name}" (ID: ${updatedCard.id})`,
      },
    });

    return NextResponse.json({ success: true, card: updatedCard });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || "Admin card update failed" }, { status: 500 });
  }
}

export async function DELETE(req: Request, { params }: { params: { id: string } }) {
  const admin = await getAdminUser();
  if (!admin) {
    return NextResponse.json({ error: "Unauthorized admin access." }, { status: 401 });
  }

  const existingCard = await db.card.findUnique({ where: { id: params.id } });
  if (!existingCard) {
    return NextResponse.json({ error: "Card not found." }, { status: 404 });
  }

  await db.card.delete({ where: { id: params.id } });

  // Create Audit Log
  await db.auditLog.create({
    data: {
      adminId: admin.id,
      action: "DELETE_CARD",
      targetCardId: params.id,
      targetUserId: existingCard.userId,
      details: `Admin ${admin.name} (${admin.email}) deleted card "${existingCard.name}" (ID: ${existingCard.id}) owned by User ID ${existingCard.userId}`,
    },
  });

  return NextResponse.json({ success: true });
}
