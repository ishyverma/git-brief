import { Octokit } from "octokit";
import { GoogleGenerativeAI } from "@google/generative-ai";
import prisma from "@/db/prisma";

const genAI = new GoogleGenerativeAI(process.env.GOOGLE_GENERATIVE_AI_API_KEY!);
const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });

export const octokit = new Octokit({
  auth: process.env.NEXT_PUBLIC_GITHUB_TOKEN,
});

interface generateSummaryProps {
  commitMessage: string;
  commitAuthor: string | undefined;
  commitAvatarUrl: string | undefined;
  commitDate: string | undefined;
  commitSha: string;
}

export async function commitLoader(githubUrl: string) {
  const [owner, repo] = githubUrl.split("/").slice(-2);
  const { data } = await octokit.rest.repos.listCommits({
    owner: owner!,
    repo: repo!,
  });

  const someCommits = data.slice(0, 15).map((commit) => {
    return {
      commitMessage: commit.commit.message,
      commitAuthor: commit.commit.author?.name,
      commitAvatarUrl: commit.author?.avatar_url,
      commitDate: commit.commit.author?.date,
      commitSha: commit.sha,
    };
  });
  return someCommits;
}

export async function pollCommit(projectId: string) {
  const { githubUrl, project } = await getProject(projectId);
  const commits = await commitLoader(githubUrl);
  return commits;
}

export async function getProject(projectId: string) {
  const project = await prisma.repo.findFirst({
    where: {
      id: projectId,
    },
  });

  if (!project?.githubUrl) {
    throw new Error("Github url is not there");
  }

  return {
    githubUrl: project?.githubUrl,
    project,
  };
}

export async function createSummary(commit: generateSummaryProps) {
  const result = await model.generateContent(
    `You are an AI assistant that helps onboard junior developers by explaining GitHub commits concisely. Analyze the following commit and provide a structured response with clear insights.

    You are an expert programmer, and your task is to summarize a Git diff in a structured and concise manner. For every modified file, the diff contains metadata lines like:  
    
    diff --git a/path/to/file.js b/path/to/file.js
    index abc123..def456 100644
    --- a/path/to/file.js
    +++ b/path/to/file.js
    markdown
    Copy
    Edit
    - Lines starting with '+' indicate additions.  
    - Lines starting with '-' indicate deletions.  
    - Other lines provide context.  

    ### Summary Format:  
    Provide a bullet-point summary of the key changes in a clear and concise manner, following this format:  
    [Short description of change] [File(s) affected]
    Example:  
    * Increased the timeout for API requests from 10s to 30s [server/api.ts]
    * Fixed a bug causing incorrect user role assignments [auth/roles.ts]
    * Added error handling for missing config values [config/index.ts]
    
    ### Instructions:  
    - Summarize functional changes without unnecessary details.  
    - If multiple files are modified for the same reason, group them together.  
    - Do not include unchanged lines.  
    - Do not generate unnecessary explanations.
    - Do not add any other line of you explaining what you will do just make the summary.
    - It should not be max then 4 lines
    
    Commit Message:
    ${commit?.commitMessage}

    Diff Output:
    https://github.com/${commit?.commitAuthor}/greatfrontend/commit/${commit?.commitSha}.diff
    
    Keep it precise, structured, and insightful.`,
  );
  return result.response.text();
}
