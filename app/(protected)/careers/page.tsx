import { signOut, auth } from "@/lib/auth";
import db from "@/lib/db";
import { Button } from "@/components/ui/button";
import { LogOut, User as UserIcon, BadgeCheck } from "lucide-react";

export default async function CareersPage() {
  const session = await auth();

  const userData = await db.user.findUnique({
    where: { id: session?.user?.id },
    include: {
      skills: true,
      education: true,
      experience: true
    }
  });

  return (
    <div className="max-w-7xl mx-auto p-6">
      <header className="flex justify-between items-center mb-8 pb-6 border-b">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-slate-900">Career Dashboard</h1>
          <p className="text-slate-500 mt-1">Welcome back, {userData?.name}</p>
        </div>
        <form action={async () => { "use server"; await signOut({ redirectTo: "/signin" }); }}>
          <Button variant="outline" className="gap-2">
            <LogOut className="h-4 w-4" /> Sign Out
          </Button>
        </form>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="md:col-span-1 space-y-6">
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
            <p className="font-bold text-slate-900 mb-4">Your Skills</p>
            <div className="flex flex-wrap gap-2">
              {userData?.skills.map((skill) => (
                <span key={skill.id} className="px-3 py-1 bg-slate-100 text-slate-600 text-xs font-bold rounded-full flex items-center gap-1">
                  <BadgeCheck className="w-3 h-3 text-blue-500" />
                  {skill.name}
                </span>
              ))}
            </div>
          </div>
        </div>

        <div className="md:col-span-3 bg-white p-12 rounded-2xl shadow-sm border border-slate-100 border-dashed text-center">
          <h3 className="text-lg font-bold">Personalized Roadmap</h3>
          <p className="text-slate-500 mt-2">Generating insights based on {userData?.skills.length} skills...</p>
        </div>
      </div>
    </div>
  );
}