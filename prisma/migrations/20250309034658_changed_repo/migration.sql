/*
  Warnings:

  - You are about to drop the column `totalCommits` on the `Repo` table. All the data in the column will be lost.
  - You are about to drop the column `totalContributors` on the `Repo` table. All the data in the column will be lost.
  - You are about to drop the column `totalMergedPrs` on the `Repo` table. All the data in the column will be lost.
  - You are about to drop the column `totalPrs` on the `Repo` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Repo" DROP COLUMN "totalCommits",
DROP COLUMN "totalContributors",
DROP COLUMN "totalMergedPrs",
DROP COLUMN "totalPrs";
