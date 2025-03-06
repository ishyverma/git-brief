import AppSidebar from '@/components/main/sidebar'
import { SidebarProvider, SidebarTrigger } from '@/components/ui/sidebar'
import { Toaster } from '@/components/ui/sonner'
import { currentUser } from '@clerk/nextjs/server'
import React from 'react'

type Props = {
    children: React.ReactNode
}

const DashboardLayout = async ({ children }: Props) => {
  const user = await currentUser()

  if (!user) {
    return null
  };

  const info = {
    fullName: user.fullName,
    email: user.emailAddresses[0]?.emailAddress,
    id: user.id
  }

  return (
    <SidebarProvider>
        <AppSidebar info={info} />
        <main>
            {children}
        </main>
        <Toaster />
    </SidebarProvider>
  )
}

export default DashboardLayout