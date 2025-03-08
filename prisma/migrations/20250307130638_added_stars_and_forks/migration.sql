/*
  Warnings:

  - Added the required column `forkCount` to the `Repo` table without a default value. This is not possible if the table is not empty.
  - Added the required column `repoImage` to the `Repo` table without a default value. This is not possible if the table is not empty.
  - Added the required column `repoName` to the `Repo` table without a default value. This is not possible if the table is not empty.
  - Added the required column `stars` to the `Repo` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Repo" ADD COLUMN     "forkCount" INTEGER NOT NULL,
ADD COLUMN     "repoImage" TEXT NOT NULL,
ADD COLUMN     "repoName" TEXT NOT NULL,
ADD COLUMN     "stars" INTEGER NOT NULL;
