import { PrismaClient, UserRole } from "@prisma/client";
import { hash } from "bcrypt";

const prisma = new PrismaClient();

async function main() {
  // Seed admin user
  const adminPassword = await hash("Admin123!", 10);
  const admin = await prisma.user.upsert({
    where: { email: "admin@soundwave.com" },
    update: {},
    create: {
      name: "Admin User",
      email: "admin@soundwave.com",
      password: adminPassword,
      role: "ADMIN",
    },
  });
  console.log(`Created admin user: ${admin.email}`);

  // Seed demo user
  const userPassword = await hash("Demo123!", 10);
  const demoUser = await prisma.user.upsert({
    where: { email: "user@example.com" },
    update: {},
    create: {
      name: "Demo User",
      email: "user@example.com",
      password: userPassword,
      role: "CUSTOMER",
    },
  });
  console.log(`Created demo user: ${demoUser.email}`);

  // Seed product categories
  const categories = await Promise.all([
    prisma.category.upsert({
      where: { slug: "headphones" },
      update: {},
      create: {
        name: "Headphones",
        slug: "headphones",
        description:
          "Over-ear and on-ear headphones with premium sound quality",
      },
    }),
    prisma.category.upsert({
      where: { slug: "earbuds" },
      update: {},
      create: {
        name: "Wireless Earbuds",
        slug: "earbuds",
        description: "Compact and portable in-ear audio solutions",
      },
    }),
    prisma.category.upsert({
      where: { slug: "speakers" },
      update: {},
      create: {
        name: "Speakers",
        slug: "speakers",
        description: "Bluetooth and smart speakers for your home and outdoors",
      },
    }),
    prisma.category.upsert({
      where: { slug: "accessories" },
      update: {},
      create: {
        name: "Accessories",
        slug: "accessories",
        description: "Enhance your audio experience with these accessories",
      },
    }),
  ]);

  console.log(`Seeded ${categories.length} categories`);

  // Add more seed data as needed
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
