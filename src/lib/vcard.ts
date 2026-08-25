export interface CardVCardData {
  name: string;
  title: string;
  status: string;
  country: string;
  bio: string;
  website?: string | null;
  linkedin?: string | null;
  instagram?: string | null;
  slug: string;
}

export function generateVCardString(card: CardVCardData): string {
  const noteLines = [
    `Status: ${card.status}`,
    `Country: ${card.country}`,
    card.bio ? `Bio: ${card.bio}` : "",
  ].filter(Boolean).join(" \\n ");

  const lines = [
    "BEGIN:VCARD",
    "VERSION:3.0",
    `FN:${card.name}`,
    `N:${card.name.split(" ").reverse().join(";")};;;`,
    `TITLE:${card.title}`,
    `NOTE:${noteLines}`,
  ];

  if (card.website) {
    lines.push(`URL;TYPE=Website:${card.website}`);
  }
  if (card.linkedin) {
    lines.push(`URL;TYPE=LinkedIn:https://linkedin.com/in/${card.linkedin.replace(/^@/, "")}`);
  }
  lines.push(`URL;TYPE=Cardora:https://cardora.io/c/${card.slug}`);
  lines.push("END:VCARD");

  return lines.join("\r\n");
}
