import { createTRPCRouter, privateProcedure } from "../trpc";
import { z } from "zod";

export const repoRouter = createTRPCRouter({
  getRepoSummary: privateProcedure
    .input(
      z.object({
        repoId: z.string(),
      }),
    )
    .query(async ({ ctx, input }) => {
      return await ctx.db.language.findMany({
        where: {
          repoId: input.repoId,
        },
      });
    }),
});
