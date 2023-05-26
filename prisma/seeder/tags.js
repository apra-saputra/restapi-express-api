import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

const tags = [
  { name: "minuman", active: true },
  { name: "makanan", active: true },
  { name: "aksesoris", active: true },
];

async function tagsSeeder() {
  await prisma.tags.createMany({ data: tags });
}

export default tagsSeeder;
