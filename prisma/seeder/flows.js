import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

const workflow = [
  {
    message: "ORDER_START",
    action: "ACT_ORDER_PRCH",
    ApprovalId: 3,
    active: true,
  },
  {
    message: "ORDER_CANCEL",
    action: "ACT_CANCEL_PRCH",
    ApprovalId: 3,
    active: true,
  },
  {
    message: "ORDER_APPROVED_BY_SPV",
    action: "ACT_APPROVE_SPV",
    ApprovalId: 2,
    active: true,
  },
  {
    message: "ORDER_REJECT_BY_SPV",
    action: "ACT_REJECT_SPV",
    ApprovalId: 2,
    active: true,
  },
  {
    message: "ORDER_APPROVED_BY_MGR",
    action: "ACT_APPROVE_MGR",
    ApprovalId: 1,
    active: true,
  },
  {
    message: "ORDER_REJECT_BY_MGR",
    action: "ACT_REJECT_MGR",
    ApprovalId: 1,
    active: true,
  },
];

async function flowSeeder() {
  await prisma.workflows.createMany({ data: workflow });
}

export default flowSeeder;
