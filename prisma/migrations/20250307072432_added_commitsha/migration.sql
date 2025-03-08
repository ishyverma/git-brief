-- CreateTable
CREATE TABLE "Commit" (
    "id" TEXT NOT NULL,
    "repoId" TEXT NOT NULL,
    "message" TEXT NOT NULL,
    "commiter" TEXT NOT NULL,
    "commitedDate" TIMESTAMP(3) NOT NULL,
    "summary" TEXT NOT NULL,
    "avatarUrl" TEXT NOT NULL,
    "commitSha" TEXT NOT NULL,

    CONSTRAINT "Commit_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Commit" ADD CONSTRAINT "Commit_repoId_fkey" FOREIGN KEY ("repoId") REFERENCES "Repo"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
