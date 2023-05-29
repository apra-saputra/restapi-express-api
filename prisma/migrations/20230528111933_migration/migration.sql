/*
  Warnings:

  - You are about to drop the column `WorkflowId` on the `Orders` table. All the data in the column will be lost.
  - You are about to drop the column `updatedAt` on the `Tags` table. All the data in the column will be lost.
  - Added the required column `updatedAt` to the `ProductOrders` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Orders" DROP CONSTRAINT "Orders_WorkflowId_fkey";

-- AlterTable
ALTER TABLE "Orders" DROP COLUMN "WorkflowId";

-- AlterTable
ALTER TABLE "ProductOrders" ADD COLUMN     "StageId" INTEGER,
ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL;

-- AlterTable
ALTER TABLE "Tags" DROP COLUMN "updatedAt";

-- AddForeignKey
ALTER TABLE "ProductOrders" ADD CONSTRAINT "ProductOrders_StageId_fkey" FOREIGN KEY ("StageId") REFERENCES "Stages"("id") ON DELETE SET NULL ON UPDATE CASCADE;
