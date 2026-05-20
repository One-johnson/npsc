import bcrypt from "bcryptjs";

const ROUNDS = 12;

/** Sync bcrypt — required because Convex mutations cannot use async bcrypt (setTimeout). */
export function hashPassword(password: string): string {
  return bcrypt.hashSync(password, ROUNDS);
}

export function verifyPassword(password: string, passwordHash: string): boolean {
  return bcrypt.compareSync(password, passwordHash);
}
