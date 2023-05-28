import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

const tags = [{ name: "minuman" }, { name: "makanan" }, { name: "aksesoris" }];

async function tagsSeeder() {
  await prisma.tags.createMany({ data: tags });
}

export default tagsSeeder;
