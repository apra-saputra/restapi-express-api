const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

const tagsSeeder = require("./seeder/tags");
const flowsSeeder = require("./seeder/flows");

async function sendersValidatersSeed() {
  const data = [
    { username: "mgr_test", position: "manager", active: true, UserId: 1 },
    { username: "spv_test", position: "supervisor", active: true, UserId: 2 },
  ];

  const sender = [
    {
      username: "operator_test",
      position: "purchesing",
      active: true,
      UserId: 1,
    },
  ];
  await prisma.validaters.createMany({ data });
  await prisma.senders.createMany({ data: sender });
}

async function userSeed() {
  const alice = await prisma.Users.upsert({
    where: { email: "alice@test.com" },
    update: {},
    create: {
      name: "alice",
      username: "mgr_test",
      email: "alice@test.com",
      active: true,
      position: "manager",
    },
  });

  const udin = await prisma.Users.upsert({
    where: { email: "udin@test.com" },
    update: {},
    create: {
      name: "udin",
      username: "spv_test",
      email: "udin@test.com",
      active: true,
      position: "supervisor",
    },
  });

  const john = await prisma.Users.upsert({
    where: { email: "john@test.com" },
    update: {},
    create: {
      name: "john",
      username: "operator_test",
      email: "john@test.com",
      active: true,
      position: "purchesing",
    },
  });
}

async function main() {
  console.log(`Start seeding ...`);
  await tagsSeeder();
  await userSeed();
  await sendersValidatersSeed();
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
