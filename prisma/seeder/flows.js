import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

// const data = [
//   { name: "ACT_APPROVE_SPV", active: true }, //1
//   { name: "ACT_APPROVE_MGR", active: true }, //2
//   { name: "ACT_REJECT_SPV", active: true }, //3
//   { name: "ACT_REJECT_MGR", active: true }, //4
//   { name: "READ_DONE", active: true }, //5
//   { name: "READ_REJECT", active: true }, //6
//   { name: "READ_APPROVE", active: true }, //7
// ];

const workflow = [
  {
    OwnerUserId: 1,
    ValidateUserId: 1,
    message: "ACT_ORDER_PRCH",
    active: true,
  },
  {
    OwnerUserId: 1,
    ValidateUserId: 1,
    message: "ACT_CANCEL_PRCH",
    active: true,
  },
  {
    OwnerUserId: 1,
    ValidateUserId: 2,
    message: "ACT_APPROVE_SPV",
    active: true,
  },
  {
    OwnerUserId: 1,
    ValidateUserId: 1,
    message: "ACT_APPROVE_MGR",
    active: true,
  },
  {
    OwnerUserId: 1,
    ValidateUserId: 2,
    message: "ACT_REJECT_SPV",
    active: true,
  },
  {
    OwnerUserId: 1,
    ValidateUserId: 1,
    message: "ACT_REJECT_MGR",
    active: true,
  },
  {
    OwnerUserId: 1,
    ValidateUserId: 1,
    message: "READ_DONE",
    active: true,
  },
  {
    OwnerUserId: 1,
    ValidateUserId: 1,
    message: "READ_REJECT_MGR",
    active: true,
  },
  {
    OwnerUserId: 1,
    ValidateUserId: 1,
    message: "READ_APPROVE_MGR",
    active: true,
  },
  {
    OwnerUserId: 1,
    ValidateUserId: 2,
    message: "READ_REJECT_SPV",
    active: true,
  },
  {
    OwnerUserId: 1,
    ValidateUserId: 2,
    message: "READ_APPROVE_SPV",
    active: true,
  },
  {
    OwnerUserId: 1,
    ValidateUserId: 2,
    message: "READ_APPROVE_SPV",
    active: true,
  },
];

async function flowSeeder() {
  await prisma.workflows.createMany({ data: workflow });
}

export default flowSeeder;
