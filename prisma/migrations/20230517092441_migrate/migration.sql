/*
  Warnings:

  - Changed the type of `active` on the `Senders` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Changed the type of `active` on the `Validaters` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- AlterTable
ALTER TABLE "Senders" DROP COLUMN "active",
ADD COLUMN     "active" BOOLEAN NOT NULL;

-- AlterTable
ALTER TABLE "Validaters" DROP COLUMN "active",
ADD COLUMN     "active" BOOLEAN NOT NULL;
