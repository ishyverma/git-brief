"use client";

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar";

import { UserButton } from "@clerk/nextjs";

import {
  Brain,
  Code,
  GitCommitHorizontal,
  GitPullRequest,
  LayoutDashboard,
  Plus,
  Zap,
} from "lucide-react";
import Link from "next/link";
import { Logo } from "../logo/logo";
import { useProject } from "@/hooks/use-project";
import CreateButton from "./create-button";
import { cn } from "@/lib/utils";
import { useRefetch } from "@/hooks/use-refetch";

interface itemsType {
  title: string;
  link: string;
  icon: React.ReactElement;
}

interface repoType {
  title: string;
  link: string;
  id: string;
}

const items: itemsType[] = [
  {
    title: "Dashboard",
    link: "/dashboard",
    icon: <LayoutDashboard />,
  },
  {
    title: "Code Analysis",
    link: "/code-analysis",
    icon: <Code />,
  },
  {
    title: "Commit Analysis",
    link: "/commit-analysis",
    icon: <GitCommitHorizontal />,
  },
  {
    title: "Predictive Insights",
    link: "/insights",
    icon: <Brain />,
  },
  {
    title: "Docker Insights",
    link: "/docker",
    icon: <Zap />,
  },
  {
    title: "Pull Requests",
    link: "/pull-requests",
    icon: <GitPullRequest />,
  },
];

const repos: repoType[] = [
  {
    title: "Calcom",
    link: "https://github.com/calcom/cal.com",
    id: "hi there",
  },
];

type Props = {
  info: {
    fullName: string | null;
    email: string | undefined;
    id: string;
  };
};

const AppSidebar = ({ info: { fullName, email, id } }: Props) => {
  const { open } = useSidebar();
  const { data, project, projectId, setProjectId } = useProject();
  const refetch = useRefetch();

  if(!data) {
    return null;
  }

  return (
    <Sidebar collapsible="icon">
      <SidebarHeader>
        <div className="flex items-center gap-2">
          <Logo />
          {open && (
            <h1 className="flex items-center justify-between gap-2 text-2xl font-bold tracking-tight">
              Git Brief
            </h1>
          )}
        </div>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Application</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {items.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <Link href={item.link}>
                      {item.icon}
                      {item.title}
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        {/* Repos */}
        <SidebarGroup>
          <SidebarGroupLabel>Repositories</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {data.map((repo) => (
                <SidebarMenuItem key={repo.name}>
                  <SidebarMenuButton
                    onClick={() => {
                      setProjectId(repo.id);
                    }}
                    asChild
                  >
                    <div>
                      <div className={cn(
                        "rounded bg-white px-[6px] py-[2px] text-sm font-medium text-black",
                        project?.id === repo.id ? "bg-[#3B9FF6] text-white" : "border"
                      )}>
                        {repo.name[0]?.toUpperCase()}
                      </div>
                      <div className="font-medium">{repo.name}</div>
                    </div>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          <CreateButton id={id} />
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter>
        <div className="flex items-center gap-2">
          <div className="flex">
            <UserButton />
          </div>
          {open && (
            <div>
              <p className="text-sm">{fullName}</p>
              <p className="text-xs text-gray-600">{email}</p>
            </div>
          )}
        </div>
      </SidebarFooter>
    </Sidebar>
  );
};

export default AppSidebar;
