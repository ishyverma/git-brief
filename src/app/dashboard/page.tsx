"use client";

import Summary from "@/components/main/summary";
import { useProject } from "@/hooks/use-project";
import { GitFork, Star } from "lucide-react";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import RepoSummary from "@/components/main/repo-summary";
import ActivityCard from "@/components/main/activity-card";
import { AnimatePresence, motion } from "motion/react";
import InsightsCard from "@/components/main/insights-card";

function Dashboard() {
  const { projectId, project } = useProject();

  if (!project) {
    return <div>Loading...</div>;
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
              <TabsTrigger value="code">Code</TabsTrigger>
              <TabsTrigger value="issues">Issues</TabsTrigger>
              <TabsTrigger value="pull_requests">Pull Requests</TabsTrigger>
            </TabsList>
          </div>
          <TabsContent value="commits">
            <Summary repoId={projectId} />
          </TabsContent>
          <TabsContent value="summary">
            <div className="flex items-center justify-between gap-4">
              <RepoSummary repoId={projectId} />
              <ActivityCard repoId={projectId} />
            </div>
            <div className="mt-4 w-full max-h-fit">
              <InsightsCard repoId={projectId} />
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}

export default Dashboard;
