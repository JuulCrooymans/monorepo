import bcrypt from "bcrypt";
import crypto from "crypto";

interface User {
  id: string;
  createdAt: Date;
  updatedAt: Date;
  email: string;
  secret: string | null;
  validTotp: boolean;
}

/**
 * Generate a secure password.
 * @param {String} password password from the user
 * @returns hashed password.
 */
export async function generatePassword(password: string): Promise<string> {
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password, salt);

  return hashedPassword;
}

/**
 * Generate a secure password.
 * @param {String} hash password hash from the user
 * @param {String} password password to compare to hash
 * @returns {Boolean}
 */
export async function comparePassword(
  hash: string,
  password: string
): Promise<boolean> {
  return await bcrypt.compare(password, hash);
}

export async function hashToken(): Promise<{
  hash: string;
  token: string;
}> {
  const resetToken = crypto.randomBytes(32).toString("hex");
  const salt = await bcrypt.genSalt(10);
  return {
    hash: await bcrypt.hash(resetToken, salt),
    token: resetToken,
  };
}

export function isAuth(user?: User): boolean {
  // If the user has 2fa enabled
  if (user && user.secret && user.validTotp) {
    return true;
  }

  if (user && user.secret && !user.validTotp) {
    return false;
  }

  if (user && !user.secret) {
    return true;
  }

  return false;
}
