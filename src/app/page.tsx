import { redirect } from "next/navigation"

export default async function Home() {
  redirect("/dashboard")
  return <div>
    GIT BRIEF
  </div>
}
