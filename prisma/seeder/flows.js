import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

const stage = [
  {
    state: "CANCEL",
    PositionId: 3,
  },
  {
    state: "AWAIT_APPROVE_SPV",
    PositionId: 2,
  },
  {
    state: "AWAIT_APPROVE_MGR",
    PositionId: 1,
  },
  {
    state: "NEED_MODIFY",
    PositionId: 3,
  },
  {
    state: "DONE",
    PositionId: 3,
  },
  {
    state: "REJECT",
    PositionId: 3,
  },
];

const workflow = [
  {
    action: "ACT_ORDER_PRCH",
    message: "ORDER_START",
    StageId: 2,
    ApproverId: 3,
    active: true,
  },
  {
    action: "ACT_CANCEL_PRCH",
    message: "ORDER_CANCEL",
    StageId: 1,
    ApproverId: 3,
    active: true,
  },
  {
    action: "ACT_APPROVE_SPV",
    message: "ORDER_APPROVED_BY_SPV",
    StageId: 3,
    ApproverId: 2,
    active: true,
  },
  {
    action: "ACT_REJECT_SPV",
    message: "ORDER_REJECT_BY_SPV",
    StageId: 4,
    ApproverId: 2,
    active: true,
  },
  {
    action: "ACT_APPROVE_MGR",
    message: "ORDER_APPROVED_BY_MGR",
    StageId: 5,
    ApproverId: 1,
    active: true,
  },
  {
    action: "ACT_REJECT_MGR",
    message: "ORDER_REJECT_BY_MGR",
    StageId: 6,
    ApproverId: 1,
    active: true,
  },
];

async function flowSeeder() {
  await prisma.stages.createMany({ data: stage });
  await prisma.workflows.createMany({ data: workflow });
}

export default flowSeeder;
