import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

const tags = [
  { name: "minuman", active: true },
  { name: "makanan", active: true },
  { name: "aksesoris", active: true },
];

const stock = [
  { TagId: 1, qty: 50 },
  { TagId: 2, qty: 50 },
  { TagId: 3, qty: 50 },
];

async function tagsSeeder() {
  await prisma.tags.createMany({ data: tags });
  await prisma.stocks.createMany({ data: stock });
}

export default tagsSeeder;
