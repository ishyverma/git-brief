import { GoogleGenerativeAI } from "@google/generative-ai";
import { octokit } from "./github-repo-loader";

const genAI = new GoogleGenerativeAI(process.env.GOOGLE_GENERATIVE_AI_API_KEY!);
const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });

export const getPackageFile = async (owner: string, repo: string): Promise<string> => {
    const packages = await octokit.rest.repos.getContent({
        owner,
        repo,
        path: 'package.json'
    })

    if (!("content" in packages.data)) {
        return ""
    }

    const data = Buffer.from(packages.data.content, "base64").toString("utf-8")
    return data
}

export const dependencyTeller = async (dependencies: string): Promise<string> => {
    const result = await model.generateContent(`
        I have a package.json file that contains dependencies and devDependencies for a project. 
        I want to extract only the most essential dependencies required for the project to function, excluding optional or less critical ones.
        You have to give only top 5 dependencies that are being used in the project. 
        Return them as an array of arrays, where each inner array contains the dependency name and its version. 
        The response from you should be a string as given in the example below.
        The dependencies that you should contain should have the main language of the project.
        The framework that they are using, the orm they are using.
        Or If they are using any monorepo or monorepo orchestrator you should consider it.
        Not take one dependency many time.
        For e.g -> If we are choosing prisma then prisma/client should not be selected same names should not get selected.
        Do not include any additional text or formatting. Only return the raw array. Example format: "["['react', '18.3.1']", "['next', '15.0.1']"]"
        The file is:
        # CONTEXT STARTS HERE
        ${dependencies}
        #CONTEXT ENDS HERE
    `)

    return result.response.text()
}