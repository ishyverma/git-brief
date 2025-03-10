import { Pinecone } from '@pinecone-database/pinecone';
import { GoogleGenerativeAI } from "@google/generative-ai";
import { GithubRepoLoader } from "@langchain/community/document_loaders/web/github";

export const langPoller = async (owner: string, name: string, repoId: string) => {
    const docs = await githubLangLoader(owner, name) 
    const [storing] = await Promise.all(
        docs.map(async (doc) => {
            await storeEmbeddings(repoId, doc.pageContent, doc.metadata.source)
        })
    )
}

export const githubLangLoader = async (owner: string, repo: string) => {
  const loader = new GithubRepoLoader(
    "https://github.com/ishyverma/thinkr",
    {
      branch: "main",
      recursive: true,
      unknown: "warn",
      maxConcurrency: 5,
      ignoreFiles: ['package.json', 'package-lock.json', '*.md', '.gitignore', '*.d.ts', '.env.*', '.env', 'yarn.lock', 'pnpm-lock.yaml'] ,
      accessToken: process.env.NEXT_PUBLIC_GITHUB_TOKEN
    },
  );
  const docs = await loader.load();
  return docs
};

const genAI = new GoogleGenerativeAI(process.env.GOOGLE_GENERATIVE_AI_API_KEY!);
const model = genAI.getGenerativeModel({ model: "text-embedding-004"});

const pc = new Pinecone({
  apiKey: process.env.PINECONE_API_KEY!,
});

export const createEmbeddings = async (content: string) => {
    const result = await model.embedContent("What is the meaning of life?");
    return result.embedding.values ?? [];
}

export const storeEmbeddings = async (id: string, text: string, source: string) => {
    try {
        console.log(source)
        const index = pc.index('git-brief');
        const vector = await createEmbeddings(text);
        if (vector.length === 0) throw new Error("Embeed generation failed");

        await index.upsert([{
            id: `${Math.random()}`,
            values: vector,
            metadata: { text, repoId: id, fileName: source }
        }])

        console.log(`Stored embedding for ID: ${id}`);

    } catch (error) {
        console.log("ERROR_UPSERTING_DATA_PINECONE", error)
    }
}

export const queryEmbedding = async (text: string, topK = 3, id: string) => {
    try {
        const index = pc.index('git-brief');   
        const vector = await createEmbeddings(text);
        if (vector.length === 0) throw new Error("Embeed generation failed");

        console.log(text)
        const queryResult = await index.query({
            vector,
            topK,
            includeMetadata: true,
            filter: { repoId: id }
        });

        return queryResult.matches;
    } catch (error) {
        console.log("ERROR_QUERYING_PINECONE", error)
    }
}