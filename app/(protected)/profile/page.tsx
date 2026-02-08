import { auth } from "@/lib/auth";
import db from "@/lib/db";
import { ProfileContent } from "@/components/pages/profile/profilePage";
import { redirect } from "next/navigation";

export default async function ProfilePage() {
    const session = await auth();

    if (!session?.user?.id) {
        redirect("/signin");
    }

    const user = await db.user.findUnique({
        where: { id: session.user.id },
        include: {
            skills: true,
            education: true,
            experience: true,
            projects: true,
        },
    });

    if (!user) return null;

    return (
        <div className="max-w-6xl mx-auto py-10 px-4 md:px-10">
            <div className="mb-10">
                <h1 className="text-3xl font-bold tracking-tight text-slate-900">Settings</h1>
                <p className="text-slate-500">Manage your account settings and professional profile.</p>
            </div>

            <ProfileContent user={user} />
        </div>
    );
}