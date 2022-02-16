import { prisma } from "./index";
import bcrypt from "bcrypt";

export async function generatePassword(password: string): Promise<string> {
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password, salt);

  return hashedPassword;
}

async function main() {
  await Promise.all([
    prisma.user.create({
      data: {
        email: "test@test.com",
        password: await generatePassword("123123"),
      },
    }),
  ]);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit();
  })
  .finally(() => {
    prisma.$disconnect();
  });
