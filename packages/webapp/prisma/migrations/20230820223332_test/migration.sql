-- AlterTable
ALTER TABLE "Session" ALTER COLUMN "expiresAt" SET DEFAULT now() + interval '1 day';
