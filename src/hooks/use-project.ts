import { api } from '@/trpc/react';
import { useLocalStorage } from 'usehooks-ts';

export const useProject = () => {
    const { data } = api.project.getProjects.useQuery()
    
    const [projectId, setProjectId] = useLocalStorage('projects', "")
    const project = data?.find(repo => repo.id === projectId)
    
    return {
        projectId,
        setProjectId,
        project,
        data
    }
}