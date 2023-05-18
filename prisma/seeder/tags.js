const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

async function main() {
  const tag = await prisma.tags.createMany({ data });
}
