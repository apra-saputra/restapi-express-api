import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function transactionCreation(
  dataInArrayOfObject,
  userid,
  workflowId
) {
  return await prisma.$transaction(async (prisma) => {
    let products = [];

    dataInArrayOfObject.forEach(async (item) => {
      const createdProduct = await prisma.products.create({
        data: item,
      });
      products.push(createdProduct);
    });

    const orders = await prisma.orders.create({
      data: {
        AuthorId: Number(userid),
        qty: getTotal(dataInArrayOfObject, "qty"),
        totalAmount:
          getTotal(dataInArrayOfObject, "price") *
          getTotal(dataInArrayOfObject, "qty"),
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
      include: { Stages: true },
    });

    let productId = [];

    productOrder.forEach((item) => {
      // item.Stages.PositionId === workflow
      if (item.Stages.PositionId !== workflow.ApproverId)
        throw { name: "NO_ACCESS" };

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

export async function transactionGetData(
  entity,
  option = { whereOption: {}, includeOption: false, skip: 0, limit: 10 }
) {
  const [data, count] = await prisma.$transaction([
    prisma[entity].findMany({
      skip: option.skip,
      take: option.limit,
      where: option.whereOption,
      include: option.includeOption,
    }),
    prisma[entity].count({ where: option.whereOption }),
  ]);
  return [data, count];
}

export async function validateTagIds(tagIds) {
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
}

export function getTotal(array, typeOfTotalKey) {
  let result = 0;

  array.forEach((item) => {
    result += Number(item[typeOfTotalKey]);
  });

  return result;
}

export function validateInput(objects) {
  for (const key in objects) {
    const item = objects[key];
    const NumberKey = ["tagId", "price", "quantity"];

    if (NumberKey.includes(key)) {
      if (!item || isNaN(item)) {
        throw {
          name: "CUSTOM",
          code: 400,
          message: `${key.toUpperCase()} INVALID`,
        };
      }
    } else {
      if (!item || !item.length) {
        throw {
          name: "CUSTOM",
          code: 400,
          message: `${key.toUpperCase()} INVALID`,
        };
      }
    }
  }
}

export async function validateWorkflow(workflowId, userId) {
  const workflow = await prisma.workflows.findFirst({
    where: { id: Number(workflowId) },
    include: { Positions: { include: { Users: true } }, Stages: true },
  });

  if (!workflow || workflow.Positions.id !== Number(userId))
    throw { name: "CUSTOM", code: 403, message: "FORBIDEN" };

  return workflow;
}
