import { registerUser } from "@/lib/register-user"

export default async function Home() {
  const user = await registerUser()
  return <div>
    {JSON.stringify(user)}
  </div>
}
