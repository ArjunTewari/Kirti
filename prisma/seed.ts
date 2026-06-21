import { PrismaClient } from "@prisma/client";
import { buildSeedUsers } from "../src/lib/seed-data";

const prisma = new PrismaClient();

async function main() {
  console.log("Seeding database…");

  const users = await buildSeedUsers();

  for (const user of users) {
    await prisma.user.upsert({
      where: { email: user.email },
      update: {},
      create: user,
    });
    console.log(`  ✓ ${user.role} ${user.name} <${user.email}>`);
  }

  console.log("Seed complete.");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
