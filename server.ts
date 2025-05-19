// This file contains server-only utilities
import { hash, compare } from "bcryptjs";

// Export server-only methods for password hashing
export async function hashPassword(password: string): Promise<string> {
  return await hash(password, 10);
}

export async function comparePasswords(
  plainPassword: string,
  hashedPassword: string
): Promise<boolean> {
  return await compare(plainPassword, hashedPassword);
}
