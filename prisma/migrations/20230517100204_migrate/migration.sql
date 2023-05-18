/*
  Warnings:

  - A unique constraint covering the columns `[UserId]` on the table `Senders` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[UserId]` on the table `Validaters` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "Senders_UserId_key" ON "Senders"("UserId");

-- CreateIndex
CREATE UNIQUE INDEX "Validaters_UserId_key" ON "Validaters"("UserId");
