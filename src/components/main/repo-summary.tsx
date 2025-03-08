import { api } from "@/trpc/react";
import { Code } from "lucide-react";
import React from "react";
import { motion } from "motion/react";
import { Badge } from "@/components/ui/badge";

type Props = {
  repoId: string;
};

const RepoSummary = ({ repoId }: Props) => {
  const { data } = api.repo.getRepoSummary.useQuery({ repoId });

  if (!data) {
    return <div>Loading...</div>;
  }

  const sumOfLines = data.reduce((a, b) => a + b.numberOfLines, 0);

  return (
    <div className="mt-4 w-full h-[250px] rounded-md border p-5">
      <p className="flex items-center gap-2 text-xl font-semibold tracking-tight text-[#3F3F44]">
        <Code className="h-5 w-5" /> Repository Overview
      </p>
      <div className="mt-4 space-y-5">
        {data.slice(0, 2).map((language) => (
          <div key={language.id}>
            <div className="flex items-center justify-between">
              <span className="text-zinc-600 text-sm">{language.name}</span>
              <span className="text-zinc-600 text-sm">
                {((language.numberOfLines / sumOfLines) * 100).toFixed(1)} %
              </span>
            </div>
            <div className="mt-1">
              <div className="h-2 w-full rounded-xl bg-neutral-200">
                <motion.div
                  initial={{
                    width: 0,
                  }}
                  animate={{
                    width: `${((language.numberOfLines / sumOfLines) * 100).toFixed(1)}%`,
                  }}
                  className={`h-2 rounded-xl`}
                  style={{
                    backgroundColor: `${language.color}`,
                  }}
                />
              </div>
            </div>
          </div>
        ))}
      </div>
      <div className="mt-5">
        <div className="flex items-center justify-between">
              <span className="text-zinc-600 text-sm">Others</span>
              <span className="text-zinc-600 text-sm">
                {(data.slice(3).reduce((a, b) => a + b.numberOfLines, 0)/sumOfLines * 100).toFixed(1)} %
              </span>
            </div>
        <div className="h-2 w-full rounded-xl bg-neutral-200">
          <div
            className={`h-2 rounded-xl`}
            style={{
              backgroundColor: `#2463EB`,
            }}
          />
        </div>
      </div>
      <div className="mt-2 flex items-center gap-2">
        {data.slice(0, 4).map((language) => (
          <div key={language.id} className="">
            <Badge variant={"outline"}>{language.name}</Badge>
          </div>
        ))}
      </div>
    </div>
  );
};

export default RepoSummary;
