import bcrypt from "bcrypt";

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
