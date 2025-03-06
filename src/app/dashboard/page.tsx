'use client'

import { useProject } from '@/hooks/use-project'
import React from 'react'

function Dashboard() {
  const { project, projectId } = useProject();

  return (
    <div>{project?.id}</div>
  )
}

export default Dashboard