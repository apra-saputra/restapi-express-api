import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

const data = [
  { name: "ACT_APPROVE_SPV", active: true }, //1
  { name: "ACT_APPROVE_MGR", active: true }, //2
  { name: "ACT_REJECT_SPV", active: true }, //3
  { name: "ACT_REJECT_MGR", active: true }, //4
  { name: "READ_DONE", active: true }, //5
  { name: "READ_REJECT", active: true }, //6
  { name: "READ_APPROVE", active: true }, //7
];

const workflow = [
  { FlowId: 1, OwnerUserId: 1, ValidateUserId: 2, active: true },
  { FlowId: 2, OwnerUserId: 1, ValidateUserId: 1, active: true },
  { FlowId: 3, OwnerUserId: 1, ValidateUserId: 2, active: true },
  { FlowId: 4, OwnerUserId: 1, ValidateUserId: 1, active: true },
  { FlowId: 5, OwnerUserId: 1, ValidateUserId: 1, active: true },
  { FlowId: 6, OwnerUserId: 1, ValidateUserId: 1, active: true },
  { FlowId: 7, OwnerUserId: 1, ValidateUserId: 1, active: true },
  { FlowId: 6, OwnerUserId: 1, ValidateUserId: 2, active: true },
  { FlowId: 7, OwnerUserId: 1, ValidateUserId: 2, active: true },
];

async function flowSeeder() {
  await prisma.flows.createMany({ data });
  await prisma.workflows.createMany({ data: workflow });
}

export default flowSeeder;
