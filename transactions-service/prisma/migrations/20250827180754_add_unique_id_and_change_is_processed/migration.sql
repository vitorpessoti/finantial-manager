/*
  Warnings:

  - Added the required column `uniqueId` to the `transactions` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "public"."transactions" ADD COLUMN     "uniqueId" TEXT NOT NULL,
ALTER COLUMN "isProcessed" SET DEFAULT false;
