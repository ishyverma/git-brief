import { dependencyTeller, getPackageFile } from "./dependency-teller"

interface parsedDataType {
    [key: string]: string
}

export const makeDependency = async (owner: string, repo: string) => {
    const dependencyString = await getPackageFile(owner, repo)
    const allDependencies = await dependencyTeller(dependencyString)
    const parsedData: parsedDataType[] = JSON.parse(allDependencies)

    return parsedData
}