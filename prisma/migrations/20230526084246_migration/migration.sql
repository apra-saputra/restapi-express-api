/*
  Warnings:

  - The `statusOrder` column on the `Products` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- CreateEnum
CREATE TYPE "StatusOrder" AS ENUM ('ORDERING', 'SATTLE');

-- AlterTable
ALTER TABLE "Products" ALTER COLUMN "imgUrl" DROP NOT NULL,
DROP COLUMN "statusOrder",
ADD COLUMN     "statusOrder" "StatusOrder";
