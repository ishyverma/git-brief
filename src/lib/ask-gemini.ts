import { RecordMetadataValue } from "@pinecone-database/pinecone"
import { smoothStream, streamText } from 'ai';
import { google } from "@ai-sdk/google";

interface askGeminiProps {
    fileName: RecordMetadataValue | undefined,
    content: RecordMetadataValue | undefined
}

export const askGemini = async (context: askGeminiProps[] | undefined) => {
    const result = streamText({
        model: google("gemini-1.5-flash-002"),
        prompt: "",
        experimental_transform: smoothStream()
    })

    return result.toTextStreamResponse({})
}