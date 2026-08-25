import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { generateVCardString } from "@/lib/vcard";

export async function GET(req: Request, { params }: { params: { slug: string } }) {
  const card = await db.card.findUnique({
    where: { slug: params.slug },
  });

  if (!card) {
    return new NextResponse("Card not found", { status: 404 });
  }

  // Increment saves count
  await db.card.update({
    where: { id: card.id },
    data: { saves: { increment: 1 } },
  });

  const vCardContent = generateVCardString({
    name: card.name,
    title: card.title,
    status: card.status,
    country: card.country,
    bio: card.bio,
    website: card.website,
    linkedin: card.linkedin,
    instagram: card.instagram,
    slug: card.slug,
  });

  return new NextResponse(vCardContent, {
    status: 200,
    headers: {
      "Content-Type": "text/vcard; charset=utf-8",
      "Content-Disposition": `attachment; filename="${card.slug}.vcf"`,
    },
  });
}
