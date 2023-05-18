const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

async function main() {
  const alice = await prisma.Users.upsert({
    where: { email: "alice@test.com" },
    update: {},
    create: {
      name: "alice",
      username: "mgr_test",
      email: "alice@test.com",
      active: true,
      phoneNumber: "12345",
      address: "jalan",
      position: "manager",
      division: "head",
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
      phoneNumber: "12345",
      address: "bukan jalan",
      position: "supervisor",
      division: "head",
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
      phoneNumber: "12345",
      address: "bukan jalan",
      position: "operator",
      division: "regional",
    },
  });

  console.log({ alice, udin, john });
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
