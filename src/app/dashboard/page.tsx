"use client";

import Summary from "@/components/main/summary";
import { useProject } from "@/hooks/use-project";
import { GitFork, Star } from "lucide-react";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import RepoSummary from "@/components/main/repo-summary";
import { AnimatePresence, motion } from "framer-motion";
import InsightsCard from "@/components/main/insights-card";
import { Logo } from "@/components/logo/logo";
import CodeGPT from "@/components/main/code-gpt";

function Dashboard() {
  const { projectId, project } = useProject();

  if (!project) {
    return (
      <div className="flex h-[100vh] w-[100vw] flex-col items-center justify-center">
        <div className="animate-spin">
          <Logo />
        </div>
        <p className="mt-4 text-xl font-semibold tracking-tight text-[#3F3F45]">
          Almost There...
        </p>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center py-5">
      <div className="w-[80vw]">
        <div className="flex items-center justify-between">
          <p className="text-4xl font-bold tracking-tighter text-[#3F3F45]">
            {project.repoName.split("/")[1]}
          </p>
          <div className="flex items-center justify-center gap-4">
            <p className="flex items-center justify-center gap-1 font-mono tracking-tighter">
              <Star className="h-4 w-4 text-yellow-500" />{" "}
              {project.stars.toLocaleString()}
            </p>
            <p className="flex items-center justify-center gap-1 font-mono tracking-tighter">
              <GitFork className="h-4 w-4 text-blue-500" />{" "}
              {project.forkCount.toLocaleString()}
            </p>
          </div>
        </div>
        <p className="text-neutral-500">{project.description}</p>
      </div>
      <div className="mt-5 w-[80vw]">
        <Tabs defaultValue="summary" className="w-[80vw] flex-1">
          <div className="rounded-lg border">
            <TabsList>
              <TabsTrigger value="summary">Summary</TabsTrigger>
              <TabsTrigger value="commits">Commits</TabsTrigger>
            </TabsList>
          </div>
          <TabsContent value="summary">
            <AnimatePresence>
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 10 }}
                transition={{ duration: 0.3, staggerChildren: 0.1 }}
              >
                <motion.div>
                  <div className="flex items-center justify-between gap-4">
                    <RepoSummary repoId={projectId} />
                  </div>
                </motion.div>
                <motion.div>
                  <div className="mt-4 max-h-fit w-full">
                    <InsightsCard repoId={projectId} />
                  </div>
                </motion.div>
              </motion.div>
            </AnimatePresence>
          </TabsContent>
          <TabsContent value="commits">
            <AnimatePresence>
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 10 }}
                transition={{ duration: 0.3, staggerChildren: 0.1 }}
              >
                <motion.div>
                  <Summary repoId={projectId} />
                </motion.div>
              </motion.div>
            </AnimatePresence>
          </TabsContent>
          <TabsContent value="code">
            <CodeGPT repoId={projectId} />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}

export default Dashboard;
