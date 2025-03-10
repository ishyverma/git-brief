import axios, { AxiosError } from "axios";

interface getContributorsContributionsProps {
    login: string;
    avatarUrl: string;
    contributions: number;
}

export async function getContributorsContributions(owner: string, repo: string): Promise<getContributorsContributionsProps[]> {
    const contributorsWithCommits: getContributorsContributionsProps[] = []
    try {
        const response = await axios.get(`https://api.github.com/repos/${owner}/${repo}/contributors?per_page=4&anon=true`, 
            {
                headers: {
                    Authorization: `Bearer ${process.env.NEXT_PUBLIC_GITHUB_TOKEN}`
                }
            }
        );
        response.data.map((contri: any) => {
            contributorsWithCommits.push({
                login: contri.login,
                avatarUrl: contri.avatar_url,
                contributions: contri.contributions
            })
        })
        return contributorsWithCommits;
    } catch (error) {
        // @ts-ignore
        console.log("Hi error", error.response.data)
        return contributorsWithCommits
    }
}

async function getContributors(owner: string, repo: string): Promise<number> {
    const response = await axios.get(`https://api.github.com/repos/${owner}/${repo}/contributors?per_page=1&anon=true`, {
        headers: {
            Authorization: `Bearer ${process.env.NEXT_PUBLIC_GITHUB_TOKEN}`
        }
    });
    console.log(response.data)
    // @ts-ignore
    const linkHeader = response.headers.get('Link');
    if (linkHeader) {
        const match = linkHeader.match(/&page=(\d+)>; rel="last"/);
        // @ts-ignore
        return match ? parseInt(match[1], 10) : 1;
    }
    return response.data.length;
}

async function getCommits(owner: string, repo: string): Promise<number> {
    const response = await axios.get(`https://api.github.com/repos/${owner}/${repo}/commits?per_page=1`, {
        headers: {
            Authorization: `Bearer ${process.env.NEXT_PUBLIC_GITHUB_TOKEN}`
        }
    });
    // @ts-ignore
    const linkHeader = response.headers.get('Link');
    if (linkHeader) {
        const match = linkHeader.match(/&page=(\d+)>; rel="last"/);
        return match ? parseInt(match[1], 10) : 1;
    }
    return response.data.length;
}

async function getPullRequests(owner: string, repo: string): Promise<number> {
    const response = await axios.get(`https://api.github.com/repos/${owner}/${repo}/pulls?state=all&per_page=1`, {
        headers: {
            Authorization: `Bearer ${process.env.NEXT_PUBLIC_GITHUB_TOKEN}`
        }
    });
    // @ts-ignore
    const linkHeader = response.headers.get('Link');
    if (linkHeader) {
        const match = linkHeader.match(/&page=(\d+)>; rel="last"/);
        // @ts-ignore
        return match ? parseInt(match[1], 10) : 1;
    }
    return response.data.length;
}


async function getMergedPRs(owner: string, repo: string): Promise<number> {
    let mergedPRs = 0;
    let page = 1;
    let perPage = 100;

    while (true) {
        try {
            const response = await axios.get(`https://api.github.com/repos/${owner}/${repo}/pulls?state=closed&per_page=${perPage}&page=${page}`, {
                headers: {
                    Authorization: `Bearer ${process.env.NEXT_PUBLIC_GITHUB_TOKEN}`
                }
            });
            const prs = response.data;
    
            if (!prs.length) break;
    
            for (const pr of prs) {
                console.log(process.env.NEXT_PUBLIC_GITHUB_TOKEN);
                const mergeResponse = await axios.get(`https://api.github.com/repos/${owner}/${repo}/pulls/${pr.number}/merge`, {
                    headers: {
                        Authorization: `Bearer ${process.env.NEXT_PUBLIC_GITHUB_TOKEN}`
                    }
                });
                if (mergeResponse.status === 204) {
                    mergedPRs++;
                }
            }
            page++;
        } catch (error) {
            console.log("GET_MERGED_PR", (error as AxiosError).response?.data)
            break
        }  
    }

    return mergedPRs;
}

interface getRepoStatsProps {
    contributors: number;
    commits: number;
    prs: number;
    merged: number;
}

export const getRepoStats = async (owner: string, repo: string): Promise<getRepoStatsProps> => {
    const contributors = await getContributors(owner, repo)
    const commits = await getCommits(owner, repo)
    const prs = await getPullRequests(owner, repo)
    const merged = await getMergedPRs(owner, repo)
    return {
        contributors,
        commits,
        prs,
        merged
    }
}