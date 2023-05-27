import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

const tags = [{ name: "TOYOTA" }, { name: "HONDA" }, { name: "KAWASAKI" }];

async function tagsSeeder() {
  await prisma.tags.createMany({ data: tags });
}

export default tagsSeeder;
