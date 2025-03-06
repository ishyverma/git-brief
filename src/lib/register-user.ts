import { db } from "@/server/db";
import { currentUser } from "@clerk/nextjs/server"
import { redirect } from "next/navigation";

export const registerUser = async () => {
    const user = await currentUser();

    if (!user) {
        return redirect("/sign-in")
    }

    const isUserPresent = await db.user.findFirst({
        where: {
            userId: user.id
        }
    })

    if(!isUserPresent) {
        const newUser = await db.user.create({
            data: {
                userId: user.id,
                fullName: user.fullName!,
                email: user.emailAddresses[0]?.emailAddress!
            }
        })

        return newUser
    }

    return isUserPresent;
}