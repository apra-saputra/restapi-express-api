/*
  Warnings:

  - You are about to drop the column `WorkflowId` on the `Orders` table. All the data in the column will be lost.
  - Added the required column `StageId` to the `Orders` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Orders" DROP CONSTRAINT "Orders_WorkflowId_fkey";

-- AlterTable
ALTER TABLE "Orders" DROP COLUMN "WorkflowId",
ADD COLUMN     "StageId" INTEGER NOT NULL;

-- AddForeignKey
ALTER TABLE "Orders" ADD CONSTRAINT "Orders_StageId_fkey" FOREIGN KEY ("StageId") REFERENCES "Stages"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
