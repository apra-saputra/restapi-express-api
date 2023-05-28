import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

import tagsSeeder from "./seeder/tags.js";
import flowsSeeder from "./seeder/flows.js";

async function positionSeed() {
  const data = [
    { position: "manager", active: true, UserId: 1 },
    { position: "supervisor", active: true, UserId: 2 },
    { position: "purchasing", active: true, UserId: 3 },
  ];

  await prisma.Positions.createMany({ data });
}

async function userSeed() {
  await prisma.Users.upsert({
    where: { email: "alice@test.com" },
    update: {},
    create: {
      name: "alice",
      username: "mgr_test",
      email: "alice@test.com",
    },
  });

  await prisma.Users.upsert({
    where: { email: "udin@test.com" },
    update: {},
    create: {
      name: "udin",
      username: "spv_test",
      email: "udin@test.com",
    },
  });

  await prisma.Users.upsert({
    where: { email: "john@test.com" },
    update: {},
    create: {
      name: "john",
      username: "operator_test",
      email: "john@test.com",
    },
  });
}

async function main() {
  console.log(`Start seeding ...`);
  await tagsSeeder();
  await userSeed();
  await positionSeed();
  await flowsSeeder();

  console.log("Seeding complete...");
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
