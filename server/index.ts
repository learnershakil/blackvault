import "server-only";
import { hash, compare } from "bcryptjs";

// Password hashing function (server-side only)
export const hashPassword = (password: string) => {
  return hash(password, 12);
};

// Password comparison function (server-side only)
export const comparePasswords = (
  plainPassword: string,
  hashedPassword: string
) => {
  return compare(plainPassword, hashedPassword);
};

// Other server-side utilities can be added here
