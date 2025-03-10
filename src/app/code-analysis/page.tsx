'use client';

import CodeGPT from '@/components/main/code-gpt';
import { useProject } from '@/hooks/use-project'
import React from 'react'

type Props = {}

const CodeAnalysis = (props: Props) => {
    const {projectId} = useProject()
    
  return (
    <div><CodeGPT repoId={projectId} /></div>
  )
}

export default CodeAnalysis