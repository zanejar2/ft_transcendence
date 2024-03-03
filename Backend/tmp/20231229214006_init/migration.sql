-- AlterTable
ALTER TABLE "user" ADD COLUMN     "inGame" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "requestGameToken" TEXT;
