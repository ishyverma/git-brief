import { z } from "zod";

import {
  createTRPCRouter,
  privateProcedure,
} from "@/server/api/trpc";
import { createSummary, pollCommit } from "@/lib/github-repo-loader";

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
      const repo = await ctx.db.repo.create({
        data: {
          name: input.name,
          githubUrl: input.githubUrl,
          githubToken: input.githubToken,
          userId: ctx.user.id,
        },
      });
      const commits = await pollCommit(repo.id)
      commits.map(async (commit) => {
        const summary = await createSummary(commit)
        console.log(summary)
      })
      return repo;
    }),
});
