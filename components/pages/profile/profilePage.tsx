"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";
import { User, ShieldCheck, AlertTriangle, FileText, Camera } from "lucide-react";
import { ProfileForm } from "./profileForm";
import { SecurityForm } from "./securityForm";
import { DeleteProfile } from "./deleteProfile";
import { Button } from "@/components/ui/button";

const tabs = [
    { id: "general", label: "General", icon: User },
    { id: "security", label: "Security", icon: ShieldCheck },
    { id: "danger", label: "Advanced", icon: AlertTriangle },
];

export function ProfileContent({ user }: { user: any }) {
    const [activeTab, setActiveTab] = useState("general");

    return (
        <div className="flex flex-col md:flex-row gap-10">
            {/* Sidebar Navigation */}
            <aside className="w-full md:w-64 space-y-1">
                <div className="mb-4">
                    <div className="relative h-20 w-20 rounded-full bg-slate-100 mb-4 overflow-hidden border">
                        <div className="absolute inset-0 flex items-center justify-center text-slate-400">
                            <User size={32} />
                        </div>
                    </div>
                    <p className="text-sm font-bold text-slate-900 truncate">{user.email}</p>
                </div>

                <nav className="space-y-1">
                    {tabs.map((tab) => (
                        <button
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id)}
                            className={cn(
                                "w-full flex items-center gap-3 px-3 py-2 text-sm font-medium rounded-md transition-colors",
                                activeTab === tab.id
                                    ? "bg-slate-100 text-slate-900"
                                    : "text-slate-500 hover:bg-slate-50 hover:text-slate-700"
                            )}
                        >
                            <tab.icon size={18} />
                            {tab.label}
                        </button>
                    ))}
                </nav>
            </aside>

            {/* Main Content Area */}
            <div className="flex-1 space-y-10">
                {activeTab === "general" && (
                    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-2">
                        {/* Visual Header Placeholders */}
                        <div className="flex gap-4 p-6 bg-white border rounded-xl shadow-sm">
                            <Button variant="outline" className="gap-2 h-9 text-xs font-bold uppercase tracking-wider">
                                <Camera size={14} /> Change Photo
                            </Button>
                            <Button variant="outline" className="gap-2 h-9 text-xs font-bold uppercase tracking-wider">
                                <FileText size={14} /> Update Resume
                            </Button>
                        </div>

                        <ProfileForm user={user} />
                    </div>
                )}

                {activeTab === "security" && (
                    <div className="animate-in fade-in slide-in-from-bottom-2">
                        <SecurityForm />
                    </div>
                )}

                {activeTab === "danger" && (
                    <div className="animate-in fade-in slide-in-from-bottom-2">
                        <DeleteProfile />
                    </div>
                )}
            </div>
        </div>
    );
}