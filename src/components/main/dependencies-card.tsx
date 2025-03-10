"use client";

import { api } from "@/trpc/react";
import { Badge } from "../ui/badge";
import { motion } from "framer-motion";
import { Skeleton } from "../ui/skeleton";

type Props = {
  repoId: string;
};

const DependenciesCard = ({ repoId }: Props) => {
  const { data, isFetching } = api.dependecy.getDependency.useQuery({ repoId })

  if (isFetching) {
    return <div className="flex flex-col flex-1">
      <Skeleton className="justify-center space-y-2 w-full mt-4 h-[50px]" />
      <Skeleton className="justify-center space-y-2 w-full mt-4 h-[50px]" />
      <Skeleton className="justify-center space-y-2 w-full mt-4 h-[50px]" />
      <Skeleton className="justify-center space-y-2 w-full mt-4 h-[50px]" />
      <Skeleton className="justify-center space-y-2 w-full mt-4 h-[50px]" />
    </div>
  }

  const containerVariants = {
    hidden: { opacity: 1 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  };

  return (
    <motion.div
      className="flex flex-col justify-center space-y-2 w-full mt-4"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      {data?.map(dependency => (
        <motion.div
          key={dependency.id}
          className="flex items-center justify-between border p-2 rounded-md"
          variants={itemVariants}
        >
          <div className="font-medium">{dependency.name}</div>
          <Badge variant="outline">{dependency.version}</Badge>
        </motion.div>
      ))}
    </motion.div>
  );
};

export default DependenciesCard;
