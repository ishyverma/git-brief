import { makeDependency } from "@/lib/make-dependency";
import { createTRPCRouter, privateProcedure } from "../trpc";
import { z } from "zod";

export const dependencyRouter = createTRPCRouter({
    createDependency: privateProcedure.input(z.object({
        owner: z.string(),
        repo: z.string(),
        repoId: z.string()
    })).mutation(async ({ ctx, input }) => {
        const data = await makeDependency(input.owner, input.repo)
        const filteredData = data.map(dependency => {
            return {
                name: dependency[0]!,
                version: dependency[1]!,
                repoId: input.repoId
            }
        })

        return await ctx.db.dependency.createMany({
            data: filteredData
        })
    }),
    getDependency: privateProcedure.input(z.object({ repoId: z.string() })).query(async ({ ctx, input }) => {
        return await ctx.db.dependency.findMany({
            where: {
                repoId: input.repoId
            }
        }) 
    })
})