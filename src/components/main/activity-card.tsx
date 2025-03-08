import { api } from "@/trpc/react";
import { BarChart, Code, GitMerge, GitPullRequest, Users } from "lucide-react";
import React from "react";
import { motion } from "motion/react";

type Props = {
  repoId: string;
};

const cardVariants = {
  hidden: { opacity: 0, y: 50 },
  show: { 
    opacity: 1, 
    y: 0, 
    transition: { duration: 0.5 } 
  },
};

const ActivityCard = ({ repoId }: Props) => {
  const { data } = api.project.getContributorsInfo.useQuery({
    projectId: repoId,
  });

  if (!data) {
    return <div>Loading...</div>;
  }

  return (
    <motion.div
    variants={cardVariants}
     className="mt-4 h-[250px] w-full rounded-md border p-5">
      <p className="flex items-center gap-2 text-xl font-semibold tracking-tight text-[#3F3F44]">
        <BarChart className="h w-5" /> Activity
      </p>
      <div className="mt-4 grid grid-cols-2 grid-rows-2 gap-5">
        <div>
          <p className="pb-1 text-zinc-600 flex items-center gap-2"><Users className="w-4 h-4" /> Contributors</p>
          <span className="mt-2 text-3xl font-bold tracking-tight">
            {data.totalContributors.toLocaleString()}
          </span>
        </div>
        <div>
          <p className="pb-1 text-zinc-600 flex items-center gap-2"><Code className="w-4 h-4" />Commits</p>
          <span className="mt-2 text-3xl font-bold tracking-tight">
            {data.totalCommits.toLocaleString()}
          </span>
        </div>
        <div>
          <p className="pb-1 text-zinc-600 flex items-center gap-2"><GitPullRequest className="w-4 h-4" />Pull Request</p>
          <span className="mt-2 text-3xl font-bold tracking-tight">
            {data.totalPrs.toLocaleString()}
          </span>
        </div>
        <div>
          <p className="pb-1 text-zinc-600 flex items-center gap-2"><GitMerge className="w-4 h-4" />Merged Requests</p>
          <span className="mt-2 text-3xl font-bold tracking-tight">
            {data.totalMergedPrs.toLocaleString()}
          </span>
        </div>
      </div>
    </motion.div>
  );
};

export default ActivityCard;
