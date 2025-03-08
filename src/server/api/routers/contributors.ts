import prisma from "@/db/prisma";
import { createTRPCRouter, privateProcedure } from "../trpc";
import { z } from "zod";
import { getContributorsContributions } from "@/lib/get-info";

export const contributorsRouter = createTRPCRouter({
  getContributors: privateProcedure
    .input(
      z.object({
        repoId: z.string(),
      }),
    )
    .query(async ({ ctx, input }) => {
      return await prisma.contributor.findMany({
        where: {
          repoId: input.repoId,
        },
      });
    }),
  createContributors: privateProcedure
    .input(
      z.object({
        repoId: z.string(),
        owner: z.string(),
        name: z.string(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const contributorsInfo = await getContributorsContributions(
        input.owner,
        input.name,
      );

      const filteredContributors = contributorsInfo.map((contributor) => ({
        name: contributor.login,
        avatarUrl: contributor.avatarUrl,
        contributions: contributor.contributions,
        repoId: input.repoId,
      }));

      await ctx.db.contributor.createMany({
        data: filteredContributors,
      });
    }),
});
