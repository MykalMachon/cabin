/*
  Warnings:

  - You are about to drop the column `handle` on the `Session` table. All the data in the column will be lost.

*/
-- DropIndex
DROP INDEX "Session_handle_key";

-- AlterTable
ALTER TABLE "Session" DROP COLUMN "handle",
ALTER COLUMN "expiresAt" SET DEFAULT now() + interval '1 day';
