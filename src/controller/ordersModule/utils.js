import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function transactionCreation(
  payload = [{}],
  userid = "" || 0,
  workflowId = "" || 0
) {
  return await prisma.$transaction(async (prisma) => {
    let products = [];

    payload.forEach(async (item) => {
      const createdProduct = await prisma.products.create({
        data: item,
      });
      products.push(createdProduct);
    });

    const orders = await prisma.orders.create({
      data: {
        AuthorId: Number(userid),
        qty: getTotal(payload, "qty"),
        totalAmount: getTotal(payload, "price") * getTotal(payload, "qty"),
      },
    });

    const dataProductOrder = products.map((product) => {
      return {
        ProductId: product.id,
        OrderId: orders.id,
        StageId: Number(workflowId),
      };
    });

    await prisma.productOrders.createMany({
      data: dataProductOrder,
    });

    return dataProductOrder;
  });
}

export async function transactionAction(orderIdInArray, workflow) {
  return await prisma.$transaction(async (prisma) => {
    const productOrder = await prisma.productOrders.findMany({
      where: { OrderId: { in: orderIdInArray } },
    });

    let productId = [];

    productOrder.forEach((item) => {
      productId.push(item.ProductId);
    });

    await prisma.products.updateMany({
      where: { id: { in: productId } },
      data: { statusOrder: workflow.Stages.state },
    });

    await prisma.productOrders.updateMany({
      where: { OrderId: { in: orderIdInArray } },
      data: { StageId: Number(workflow.Stages.id) },
    });

    return "SUCCESS UPDATE";
  });
}

export async function validateTagIds(tagIds = []) {
  try {
    const existingTags = await prisma.tags.findMany({
      where: {
        id: {
          in: tagIds,
        },
      },
    });

    const existingTagIds = existingTags.map((tag) => tag.id);
    const invalidTagIndexes = tagIds.reduce((invalidIndexes, tagId, index) => {
      if (!existingTagIds.includes(tagId)) {
        invalidIndexes.push(index);
      }
      return invalidIndexes;
    }, []);

    return {
      isValid: invalidTagIndexes.length === 0,
      invalidIndexes: invalidTagIndexes ? Number(invalidTagIndexes) + 1 : 0,
    };
  } catch (error) {
    console.error(error);
    throw new Error("Gagal memvalidasi tag berdasarkan ID.");
  }
}

export function getTotal(array = [], typeOfTotalKey = "") {
  let result = 0;

  array.forEach((item) => {
    result += Number(item[typeOfTotalKey]);
  });

  return result;
}
