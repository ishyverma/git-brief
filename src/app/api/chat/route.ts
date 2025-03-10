import { queryEmbedding } from "@/lib/git-chat";
import { google } from "@ai-sdk/google";
import { smoothStream, streamText } from "ai";
import { NextRequest } from "next/server";

export async function POST(req: NextRequest) {
    const data = await req.json();
    const message = data.message
    const repoId = data.repoId

    const queryMatching = await queryEmbedding(message, 3, repoId)

    const filteredData = queryMatching?.map(query => {
        return {
            fileName: query.metadata?.fileName,
            content: query.metadata?.text
        }
    })

    const result = streamText({
        model: google("gemini-1.5-flash-002"),
        prompt: `
        You are a senior level engineer who helps junior developer who are onboarding to the team.
        I will ask you the question based on the github repository and i will also provide you with the context.
        So based on the context you have to give the answer.
        It should be very helful and easy for me to understand.

        ## CONTEXT STARTS HERE
        ${filteredData?.map(data => {
            return JSON.stringify({fileName: data.fileName, content: data.content})
        })}
        ## CONTEXT ENDS HERE

        I will now ask question for this content please help me giving answer for the question

        ## QUESTION STARTS HERE
        ${message}
        ## QUESTION ENDS HERE

        Don't add unnecessary lines where you are telling me like from the context I can understand that this is that.
        No Just give me the answer to the question.
        And If there anything that is extremely necessary to provide then add that also.
        It should not be cold reply not a single line.
        It should contains the necessary data.
        Don't add the things that based on the context. No ❌
        It should be a very engaing answer that I like and ask further question

        Parse the data and give answer
        `,
        experimental_transform: smoothStream()
    })

    return result.toDataStreamResponse({})
}