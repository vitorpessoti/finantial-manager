/*
  Warnings:

  - Added the required column `isProcessed` to the `transactions` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "public"."transactions" ADD COLUMN     "isProcessed" BOOLEAN NOT NULL;
