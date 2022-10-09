/*
  Warnings:

  - The `votes` column on the `Proposal` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- AlterTable
ALTER TABLE "Proposal" DROP COLUMN "votes",
ADD COLUMN     "votes" TEXT[];
