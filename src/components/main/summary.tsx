"use client";

import { api } from "@/trpc/react";
import SummaryCard from "./summary-card";
import { Input } from "../ui/input";
import { useState } from "react";
import { delay, motion } from "motion/react";
import { Skeleton } from "../ui/skeleton";

interface SummaryCardProps {
  repoId: string;
}

const containerVariants = {
  hidden: { opacity: 1 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.5,
    },
  },
};

const cardVariants = {
  hidden: { opacity: 0, y: 50 },
  show: { 
    opacity: 1, 
    y: 0, 
    transition: { duration: 0.5 } 
  },
};

const Summary = ({ repoId }: SummaryCardProps) => {
  const { data, isLoading } = api.project.getCommits.useQuery({ projectId: repoId });
  const [value, setValue] = useState("");

  if (isLoading) {
    return <>
      <Skeleton className="my-2 flex flex-col items-center justify-center" />
      <Skeleton className="my-2 flex flex-col items-center justify-center" />
      <Skeleton className="my-2 flex flex-col items-center justify-center" />
      <Skeleton className="my-2 flex flex-col items-center justify-center" />
      <Skeleton className="my-2 flex flex-col items-center justify-center" />
    </>
  }

  return (
    <div className="my-2 flex flex-col items-center justify-center">
      <div className="mb-2 w-[80vw]">
        <Input
          value={value}
          onChange={(e) => setValue(e.target.value)}
          placeholder="Search commits..."
        />
      </div>
      <div>
        <div className="w-[80vw]">
          {value ? (
            <div className="space-y-2">
              {data
                ?.filter(
                  (commit) =>
                    commit.commiter
                      .toLowerCase()
                      .includes(value.toLowerCase()) ||
                    commit.commitSha.includes(value.toLowerCase()),
                )
                .map((commit) => (
                  <motion.div
                    variants={containerVariants}
                    initial="hidden"
                    animate="show"
                    key={commit.commitSha}
                  >
                    <motion.div variants={cardVariants}>
                      <SummaryCard commit={commit} />
                    </motion.div>
                  </motion.div>
                ))}
            </div>
          ) : (
            <div className="space-y-2">
              {data?.map((commit) => (
                <motion.div
                  variants={containerVariants}
                  initial="hidden"
                  animate="show"
                  key={commit.commitSha}
                >
                  <motion.div variants={cardVariants}>
                    <SummaryCard commit={commit} />
                  </motion.div>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Summary;
