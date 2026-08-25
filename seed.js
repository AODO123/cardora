const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const db = new PrismaClient();

async function main() {
  console.log("Seeding Cardora database with new logo theme...");

  // 1. Create Admin User
  const adminPasswordHash = await bcrypt.hash("admin12345", 10);
  const admin = await db.user.upsert({
    where: { email: "admin@cardora.io" },
    update: {},
    create: {
      email: "admin@cardora.io",
      name: "Site Owner (Admin)",
      passwordHash: adminPasswordHash,
      plan: "PAID",
      role: "ADMIN",
    },
  });

  // 2. Create Demo User
  const userPasswordHash = await bcrypt.hash("password123", 10);
  const demoUser = await db.user.upsert({
    where: { email: "alex@cardora.io" },
    update: {},
    create: {
      email: "alex@cardora.io",
      name: "Alex Rivera",
      passwordHash: userPasswordHash,
      plan: "PAID",
      role: "USER",
    },
  });

  // 3. Create Seed Cards
  const cards = [
    {
      slug: "alex-rivera",
      userId: demoUser.id,
      name: "Alex Rivera",
      photoUrl: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&auto=format&fit=crop&q=80",
      country: "United States",
      status: "Professional",
      title: "Head of Product @ TechCorp",
      bio: "Building next-gen digital identity tools. Tapped via physical Cardora NFC prototype card!",
      instagram: "alexrivera.ui",
      linkedin: "alexrivera-product",
      website: "https://alexrivera.design",
      mbti: "INTJ-A",
      interests: "UI/UX, System Architecture, Coffee",
      favoriteSong: "Starboy - The Weeknd",
      favoriteMovie: "Interstellar",
      theme: "sunset-gradient",
      primaryColor: "#f43f5e",
      views: 142,
      linkClicks: 38,
      saves: 19,
    },
    {
      slug: "elena-rostova",
      userId: demoUser.id,
      name: "Elena Rostova",
      photoUrl: "https://images.unsplash.com/photo-1517841905240-472988babdf9?w=400&auto=format&fit=crop&q=80",
      country: "Germany",
      status: "Professional",
      title: "Senior Design System Lead",
      bio: "Designing dark-mode grotesk UI design systems and web apps.",
      instagram: "elena.design",
      linkedin: "elena-rostova",
      website: "https://elena.design",
      mbti: "ENFP-A",
      interests: "Design Systems, Motion Graphics",
      favoriteSong: "Blinding Lights - The Weeknd",
      favoriteMovie: "Blade Runner 2049",
      theme: "violet-glow",
      primaryColor: "#a855f7",
      views: 98,
      linkClicks: 24,
      saves: 12,
    },
  ];

  for (const c of cards) {
    await db.card.upsert({
      where: { slug: c.slug },
      update: c,
      create: c,
    });
  }

  // 4. Create Initial Audit Log
  await db.auditLog.create({
    data: {
      adminId: admin.id,
      action: "SYSTEM_THEME_UPDATE",
      details: "Cardora logo updated and site palette converted to Purple-Rose-Orange Sunset Theme.",
    },
  });

  console.log("Database seeding with new theme completed successfully!");
}

main()
  .catch((e) => {
    console.error("Seeding error:", e);
    process.exit(1);
  })
  .finally(async () => {
    await db.$disconnect();
  });
