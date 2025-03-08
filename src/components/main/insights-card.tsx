import React from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";
import ContributorsCard from "./contributors-card";
import DependenciesCard from "./dependencies-card";
import { Brain } from "lucide-react";

type Props = {
  repoId: string;
};

const InsightsCard = ({ repoId }: Props) => {
  return (
    <div className="flex flex-col rounded-md border p-5">
      <p className="text-xl font-semibold tracking-tight text-[#3F3F44] flex items-center gap-2">
        <Brain className="w-5 h-5" /> Repository Insights
      </p>
      <Tabs defaultValue="contributors" className="w-full mt-2">
        <TabsList className="border rounded-md mt-2">
          <TabsTrigger value="contributors">Contributors</TabsTrigger>
          <TabsTrigger value="dependencies">Dependencies</TabsTrigger>
        </TabsList>
        <TabsContent value="contributors" className="flex-1">
          <ContributorsCard repoId={repoId} />
        </TabsContent>
        <TabsContent value="dependencies">
            <DependenciesCard repoId={repoId} />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default InsightsCard;
