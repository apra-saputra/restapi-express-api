/*
  Warnings:

  - You are about to drop the column `orderId` on the `ProductOrders` table. All the data in the column will be lost.
  - You are about to drop the column `productId` on the `ProductOrders` table. All the data in the column will be lost.
  - You are about to drop the column `OrdersId` on the `Stages` table. All the data in the column will be lost.
  - You are about to drop the column `UserPositionId` on the `Stages` table. All the data in the column will be lost.
  - You are about to drop the column `ApprovalId` on the `Workflows` table. All the data in the column will be lost.
  - Added the required column `PositionId` to the `Stages` table without a default value. This is not possible if the table is not empty.
  - Added the required column `state` to the `Stages` table without a default value. This is not possible if the table is not empty.
  - Added the required column `ApproverId` to the `Workflows` table without a default value. This is not possible if the table is not empty.
  - Added the required column `StageId` to the `Workflows` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "ProductOrders" DROP CONSTRAINT "ProductOrders_orderId_fkey";

-- DropForeignKey
ALTER TABLE "ProductOrders" DROP CONSTRAINT "ProductOrders_productId_fkey";

-- DropForeignKey
ALTER TABLE "Stages" DROP CONSTRAINT "Stages_OrdersId_fkey";

-- DropForeignKey
ALTER TABLE "Stages" DROP CONSTRAINT "Stages_UserPositionId_fkey";

-- DropForeignKey
ALTER TABLE "Workflows" DROP CONSTRAINT "Workflows_ApprovalId_fkey";

-- DropIndex
DROP INDEX "Stages_OrdersId_key";

-- AlterTable
ALTER TABLE "ProductOrders" DROP COLUMN "orderId",
DROP COLUMN "productId",
ADD COLUMN     "OrderId" INTEGER,
ADD COLUMN     "ProductId" INTEGER;

-- AlterTable
ALTER TABLE "Stages" DROP COLUMN "OrdersId",
DROP COLUMN "UserPositionId",
ADD COLUMN     "PositionId" INTEGER NOT NULL,
ADD COLUMN     "state" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "Workflows" DROP COLUMN "ApprovalId",
ADD COLUMN     "ApproverId" INTEGER NOT NULL,
ADD COLUMN     "StageId" INTEGER NOT NULL;

-- AddForeignKey
ALTER TABLE "Workflows" ADD CONSTRAINT "Workflows_StageId_fkey" FOREIGN KEY ("StageId") REFERENCES "Stages"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Workflows" ADD CONSTRAINT "Workflows_ApproverId_fkey" FOREIGN KEY ("ApproverId") REFERENCES "Positions"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Stages" ADD CONSTRAINT "Stages_PositionId_fkey" FOREIGN KEY ("PositionId") REFERENCES "Positions"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ProductOrders" ADD CONSTRAINT "ProductOrders_ProductId_fkey" FOREIGN KEY ("ProductId") REFERENCES "Products"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ProductOrders" ADD CONSTRAINT "ProductOrders_OrderId_fkey" FOREIGN KEY ("OrderId") REFERENCES "Orders"("id") ON DELETE SET NULL ON UPDATE CASCADE;
