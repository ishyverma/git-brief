import React from 'react'

type Props = {
    children: React.ReactNode
}

const AuthLayout = ({ children }: Props) => {
  return (
    <div className='h-[100vh] w-[100vw] flex items-center justify-center'>{children}</div>
  )
}

export default AuthLayout