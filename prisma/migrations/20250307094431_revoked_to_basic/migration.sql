/*
  Warnings:

  - You are about to drop the column `description` on the `Repo` table. All the data in the column will be lost.
  - You are about to drop the column `githubName` on the `Repo` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Repo" DROP COLUMN "description",
DROP COLUMN "githubName";
