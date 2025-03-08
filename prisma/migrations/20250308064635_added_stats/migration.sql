/*
  Warnings:

  - Added the required column `totalCommits` to the `Repo` table without a default value. This is not possible if the table is not empty.
  - Added the required column `totalContributors` to the `Repo` table without a default value. This is not possible if the table is not empty.
  - Added the required column `totalMergedPrs` to the `Repo` table without a default value. This is not possible if the table is not empty.
  - Added the required column `totalPrs` to the `Repo` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Repo" ADD COLUMN     "totalCommits" INTEGER NOT NULL,
ADD COLUMN     "totalContributors" INTEGER NOT NULL,
ADD COLUMN     "totalMergedPrs" INTEGER NOT NULL,
ADD COLUMN     "totalPrs" INTEGER NOT NULL;
