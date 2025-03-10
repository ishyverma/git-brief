import { z } from "zod";

import { createTRPCRouter, privateProcedure } from "@/server/api/trpc";
import { createSummary, pollCommit } from "@/lib/github-repo-loader";
import axios from "axios";
import getColors from "@/lib/get-colors";
import { contributorsRouter } from "./contributors";
import { dependencyRouter } from "./dependency";
import { langPoller } from "@/lib/git-chat";

export const projectRouter = createTRPCRouter({
  getProjects: privateProcedure.query(async ({ ctx }) => {
    return await ctx.db.repo.findMany({
      where: {
        userId: ctx.user.id,
      },
    });
  }),
  createProject: privateProcedure
    .input(
      z.object({
        name: z.string(),
        githubUrl: z.string(),
        githubToken: z.string().optional(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      try {
        const url = new URL(input.githubUrl);
        const [owner, name] = url.pathname.split("/").filter(Boolean).slice(-2);

        const response = await axios.get(
          `https://api.github.com/repos/${owner}/${name}`,
          {
            headers: {
              Authorization: `Bearer ${process.env.NEXT_PUBLIC_GITHUB_TOKEN}`,
            },
          },
        );

        if (!owner || !name) {
          throw new Error("Invalid GitHub repository URL");
        }

        const {
          full_name: githubName,
          stargazers_count: stars,
          forks_count: forks,
          owner: { avatar_url: githubImage },
          description,
        } = response.data;

        const [colors] = await Promise.all([
          getColors(owner, name),
        ]);

        const repo = await ctx.db.repo.create({
          data: {
            name: input.name,
            githubUrl: input.githubUrl,
            githubToken: input.githubToken,
            userId: ctx.user.id,
            forkCount: forks,
            repoName: githubName,
            stars,
            repoImage: githubImage,
            description,
          },
        });

        const [contributorCaller, dependencyCaller, repoLoader] = await Promise.all([
          contributorsRouter.createCaller(ctx).createContributors({
            repoId: repo.id,
            name: name,
            owner: owner,
          }),
          dependencyRouter.createCaller(ctx).createDependency({
            owner: owner,
            repo: name,
            repoId: repo.id,
          }),
          langPoller(owner, name, repo.id)
        ]);

        const filteredLanguage = colors.map((color) => ({
          repoId: repo.id,
          color: color.color,
          name: color.language,
          numberOfLines: color.line,
        }));

        const [commits] = await Promise.all([
          pollCommit(repo.id),
          ctx.db.language.createMany({
            data: filteredLanguage,
          }),
        ]);

        await Promise.all(
          commits.map(async (commit) => {
            const summary = await createSummary(commit);
            await ctx.db.commit.create({
              data: {
                repoId: repo.id,
                avatarUrl: commit.commitAvatarUrl!,
                commitedDate: commit.commitDate!,
                commiter: commit.commitAuthor!,
                message: commit.commitMessage,
                summary: summary,
                commitSha: commit.commitSha,
              },
            });
          }),
        );

        return repo;

      } catch (error) {
        console.log("CREATE_PROJECT_ERROR", error);
      }
    }),
  getCommits: privateProcedure
    .input(
      z.object({
        projectId: z.string(),
      }),
    )
    .query(async ({ ctx, input }) => {
      return await ctx.db.commit.findMany({
        where: {
          repoId: input.projectId,
        },
      });
    }),
});
