import bcrypt from "bcryptjs";
import { SignJWT, jwtVerify } from "jose";
import { cookies } from "next/headers";
import { db } from "./db";

const JWT_SECRET = new TextEncoder().encode(
  process.env.JWT_SECRET || "cardora_production_jwt_secret_key_2026_super_secure"
);

export async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, 10);
}

export async function verifyPassword(password: string, hash: string): Promise<boolean> {
  return bcrypt.compare(password, hash);
}

export async function signSessionToken(payload: { userId: string; role: string; email: string }) {
  return new SignJWT(payload)
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("7d")
    .sign(JWT_SECRET);
}

export async function verifySessionToken(token: string) {
  try {
    const verified = await jwtVerify(token, JWT_SECRET);
    return verified.payload as { userId: string; role: string; email: string };
  } catch (err) {
    return null;
  }
}

export async function getCurrentUser() {
  const cookieStore = cookies();
  const token = cookieStore.get("cardora_session")?.value;
  if (!token) return null;

  const payload = await verifySessionToken(token);
  if (!payload || !payload.userId) return null;

  const user = await db.user.findUnique({
    where: { id: payload.userId },
    select: {
      id: true,
      email: true,
      name: true,
      plan: true,
      role: true,
      createdAt: true,
    },
  });

  return user;
}

export async function getAdminUser() {
  const cookieStore = cookies();
  const token = cookieStore.get("cardora_admin_session")?.value;
  if (!token) return null;

  const payload = await verifySessionToken(token);
  if (!payload || !payload.userId || payload.role !== "ADMIN") return null;

  const admin = await db.user.findFirst({
    where: { id: payload.userId, role: "ADMIN" },
    select: {
      id: true,
      email: true,
      name: true,
      role: true,
    },
  });

  return admin;
}
