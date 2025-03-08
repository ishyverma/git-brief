import { api } from "@/trpc/react";
import Image from "next/image";
import React from "react";
import { motion } from "motion/react";

type Props = {
  repoId: string;
};

const ContributorsCard = ({ repoId }: Props) => {
  const { data } = api.contributor.getContributors.useQuery({ repoId });

  if (!data) {
    return <div>Loading...</div>;
  }

  return (
    <div className="mt-4 grid grid-cols-2 justify-between gap-4">
      {data.map((contributor) => (
        <div key={contributor.id} className="">
          <div className="flex items-center gap-3 rounded-md border p-4">
            <div className="">
              <motion.div
                whileHover={{ scale: 1.1 }}
                transition={{ type: "spring", stiffness: 400, damping: 10 }}
              >
                <Image
                  className="rounded-full ring-1 ring-pink-300"
                  src={contributor.avatarUrl}
                  alt="contributorImage"
                  height={50}
                  width={50}
                />
              </motion.div>
            </div>
            <div className="">
              <p className="font-medium text-neutral-700">{contributor.name}</p>
              <p className="text-sm text-neutral-500">
                {contributor.contributions.toLocaleString()} commits
              </p>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default ContributorsCard;
