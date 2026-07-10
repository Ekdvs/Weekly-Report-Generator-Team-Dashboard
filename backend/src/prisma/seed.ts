import { PrismaClient, Role } from "@prisma/client";
import bcrypt from "bcrypt";

const prisma = new PrismaClient();

const SEED_MANAGER = {
  name: "Admin",
  email: "admin@gmail.com",
  password: "123456", 
};

async function main() {
  const existing = await prisma.user.findUnique({
    where: { email: SEED_MANAGER.email },
  });

  if (existing) {
    console.log(`Manager account already exists, skipping: ${SEED_MANAGER.email}`);
    return;
  }

  const hashedPassword = await bcrypt.hash(SEED_MANAGER.password, 10);

  const manager = await prisma.user.create({
    data: {
      name: SEED_MANAGER.name,
      email: SEED_MANAGER.email,
      password: hashedPassword,
      role: Role.MANAGER,
    },
  });

  console.log(`Created manager account: ${manager.email} (id: ${manager.id})`);
  console.log(`Login with email "${SEED_MANAGER.email}" and password "${SEED_MANAGER.password}"`);
}

main()
  .catch((err) => {
    console.error("Seed failed:", err);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });