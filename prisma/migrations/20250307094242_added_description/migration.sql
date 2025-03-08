/*
  Warnings:

  - Added the required column `description` to the `Repo` table without a default value. This is not possible if the table is not empty.
  - Added the required column `githubName` to the `Repo` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Repo" ADD COLUMN     "description" TEXT NOT NULL,
ADD COLUMN     "githubName" TEXT NOT NULL;
