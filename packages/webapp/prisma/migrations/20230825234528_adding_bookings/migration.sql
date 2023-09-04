-- CreateEnum
CREATE TYPE "UserRoleType" AS ENUM ('ADMIN', 'USER', 'GUEST');

-- AlterTable
ALTER TABLE "Session" ALTER COLUMN "expiresAt" SET DEFAULT now() + interval '7 days';

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "roles" "UserRoleType"[] DEFAULT ARRAY['USER']::"UserRoleType"[];

-- CreateTable
CREATE TABLE "Booking" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "status" TEXT NOT NULL,
    "checkIn" TIMESTAMP(3) NOT NULL,
    "checkOut" TIMESTAMP(3) NOT NULL,
    "notes" TEXT,
    "userRequestedId" TEXT NOT NULL,
    "userDecidedId" TEXT NOT NULL,

    CONSTRAINT "Booking_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Booking" ADD CONSTRAINT "Booking_userRequestedId_fkey" FOREIGN KEY ("userRequestedId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Booking" ADD CONSTRAINT "Booking_userDecidedId_fkey" FOREIGN KEY ("userDecidedId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
