-- CreateTable
CREATE TABLE "Users" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "username" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "active" BOOLEAN,
    "phoneNumber" TEXT,
    "address" TEXT,
    "position" TEXT NOT NULL,
    "division" TEXT NOT NULL,

    CONSTRAINT "Users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Senders" (
    "id" SERIAL NOT NULL,
    "username" TEXT NOT NULL,
    "position" TEXT NOT NULL,
    "active" TEXT NOT NULL,
    "UserId" INTEGER NOT NULL,

    CONSTRAINT "Senders_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Validaters" (
    "id" SERIAL NOT NULL,
    "username" TEXT NOT NULL,
    "position" TEXT NOT NULL,
    "active" TEXT NOT NULL,
    "UserId" INTEGER NOT NULL,

    CONSTRAINT "Validaters_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Flows" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "active" BOOLEAN,

    CONSTRAINT "Flows_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Workflows" (
    "id" SERIAL NOT NULL,
    "FlowId" INTEGER NOT NULL,
    "ValidateUserId" INTEGER NOT NULL,
    "OwnerUserId" INTEGER NOT NULL,
    "active" BOOLEAN NOT NULL,

    CONSTRAINT "Workflows_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Tags" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "active" BOOLEAN NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Tags_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Products" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "imgUrl" TEXT NOT NULL,
    "qty" INTEGER NOT NULL,
    "price" INTEGER NOT NULL,
    "status" TEXT NOT NULL,
    "TagId" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Products_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Orders" (
    "id" SERIAL NOT NULL,
    "ProductId" INTEGER NOT NULL,
    "OwnerId" INTEGER NOT NULL,
    "qty" INTEGER NOT NULL,
    "totalAmount" INTEGER NOT NULL,
    "message" TEXT,
    "FlowId" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Orders_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Users_username_key" ON "Users"("username");

-- CreateIndex
CREATE UNIQUE INDEX "Users_email_key" ON "Users"("email");

-- CreateIndex
CREATE UNIQUE INDEX "Workflows_FlowId_key" ON "Workflows"("FlowId");

-- AddForeignKey
ALTER TABLE "Senders" ADD CONSTRAINT "Senders_UserId_fkey" FOREIGN KEY ("UserId") REFERENCES "Users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Validaters" ADD CONSTRAINT "Validaters_UserId_fkey" FOREIGN KEY ("UserId") REFERENCES "Users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Workflows" ADD CONSTRAINT "Workflows_FlowId_fkey" FOREIGN KEY ("FlowId") REFERENCES "Flows"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Workflows" ADD CONSTRAINT "Workflows_ValidateUserId_fkey" FOREIGN KEY ("ValidateUserId") REFERENCES "Validaters"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Workflows" ADD CONSTRAINT "Workflows_OwnerUserId_fkey" FOREIGN KEY ("OwnerUserId") REFERENCES "Senders"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Products" ADD CONSTRAINT "Products_TagId_fkey" FOREIGN KEY ("TagId") REFERENCES "Tags"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Orders" ADD CONSTRAINT "Orders_ProductId_fkey" FOREIGN KEY ("ProductId") REFERENCES "Products"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Orders" ADD CONSTRAINT "Orders_OwnerId_fkey" FOREIGN KEY ("OwnerId") REFERENCES "Senders"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Orders" ADD CONSTRAINT "Orders_FlowId_fkey" FOREIGN KEY ("FlowId") REFERENCES "Flows"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
