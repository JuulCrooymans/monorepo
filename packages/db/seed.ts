import { prisma } from "./index";

async function main() {
  await Promise.all([
    prisma.user.create({
      data: {
        email: "test@test.com",
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
