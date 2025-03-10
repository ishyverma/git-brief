import { GoogleGenerativeAI } from "@google/generative-ai";
import { octokit } from "./github-repo-loader";

const genAI = new GoogleGenerativeAI(process.env.GOOGLE_GENERATIVE_AI_API_KEY!);
const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });

export const getPackageFile = async (
  owner: string,
  repo: string,
): Promise<string> => {
  const packages = await octokit.rest.repos.getContent({
    owner,
    repo,
    path: "package.json",
  });

  if (!("content" in packages.data)) {
    return "";
  }

  const data = Buffer.from(packages.data.content, "base64").toString("utf-8");
  return data;
};

export const dependencyTeller = async (
  dependencies: string,
): Promise<string> => {
  const result = await model.generateContent(`
        Give me a JSON stringified array that can be easily parsed into a JavaScript array. The array should contain dependencies in the form of nested arrays, where each inner array consists of exactly two values: the dependency name (as a string) and its version (also as a string). Ensure the output is properly formatted so that JSON.parse(output) in JavaScript returns a valid array structure. Example format: '[[\"dependency1\", \"1.0.0\"], [\"dependency2\", \"2.3.4\"]]'."
        Just give me the top 5 dependencies which should cover the frotend framework, backend framework or any full stack framework.
        Should have an ORM or an database.
        Should have monorepo if have.
        If it is having an dependency that oou have choosen then no othere dependency should contains that dependency in other dependencies.
        This should ensure you get a properly formatted JSON string that can be parsed easily.

        ## **Package File:**    +

        CONTEXT STARTS HERE     +
        ${dependencies}     +
        CONTEXT ENDS HERE   +
    `);

    const cleanedResponse = result.response.text().trim().replace(/^```json\s*/, "").replace(/\s*```$/, "");;
  return cleanedResponse;
};
