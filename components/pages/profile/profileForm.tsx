"use client";

import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { updateProfileAction } from "@/actions/profile";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";
import { 
  Loader2, Save, Plus, Trash2, GraduationCap, Briefcase, 
  FolderKanban, Code, X, Award, Building2 
} from "lucide-react";

export function ProfileForm({ user }: { user: any }) {
  const [data, setData] = useState({
    name: user.name || "",
    bio: user.bio || "",
    skills: user.skills?.map((s: any) => s.name) || [],
    experience: user.experience || [],
    education: user.education || [],
    projects: user.projects || [],
  });

  const mutation = useMutation({
    mutationFn: () => updateProfileAction(data),
    onSuccess: (res: any) => {
      if (res.success) toast.success("Professional profile updated");
      else toast.error(res.error);
    }
  });

  return (
    <div className="space-y-10 pb-20">
      {/* 1. Basic Info */}
      <Card className="border-slate-200 shadow-sm">
        <CardHeader className="border-b bg-slate-50/30">
          <CardTitle className="text-lg font-bold">Personal Information</CardTitle>
        </CardHeader>
        <CardContent className="p-6 space-y-6">
          <div className="space-y-4">
            <div className="space-y-1.5">
              <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">Full Name</label>
              <Input value={data.name} onChange={e => setData({...data, name: e.target.value})} className="h-11" />
            </div>
            <div className="space-y-1.5">
              <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">Professional Bio</label>
              <Textarea value={data.bio} onChange={e => setData({...data, bio: e.target.value})} className="min-h-[120px] resize-none" />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* 2. Skills */}
      <Card className="border-slate-200 shadow-sm">
        <CardHeader className="border-b bg-slate-50/30 flex flex-row items-center gap-2">
          <Code size={18} className="text-slate-400" />
          <CardTitle className="text-lg font-bold">Core Skills</CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          <div className="flex flex-wrap gap-2 p-4 border rounded-xl bg-slate-50/50">
            {data.skills.map((s: string, i: number) => (
              <span key={i} className="bg-slate-900 text-white px-3 py-1.5 rounded-full text-xs font-medium flex items-center gap-2">
                {s} <X size={12} className="cursor-pointer opacity-70 hover:opacity-100" onClick={() => {
                  const n = [...data.skills]; n.splice(i, 1); setData({...data, skills: n});
                }}/>
              </span>
            ))}
            <Input 
              placeholder="Add skill..." 
              className="w-32 h-8 text-xs border-none bg-transparent focus-visible:ring-0" 
              onKeyDown={(e: any) => {
                if(e.key === 'Enter' && e.target.value) {
                  setData({...data, skills: [...data.skills, e.target.value]}); 
                  e.target.value = "";
                }
              }}
            />
          </div>
        </CardContent>
      </Card>

      {/* 3. Experience */}
      <Card className="border-slate-200 shadow-sm">
        <CardHeader className="border-b bg-slate-50/30 flex flex-row items-center justify-between">
          <div className="flex items-center gap-2">
            <Briefcase size={18} className="text-slate-400" />
            <CardTitle className="text-lg font-bold">Work History</CardTitle>
          </div>
          <Button variant="outline" size="sm" onClick={() => setData({...data, experience: [...data.experience, {company: "", position: "", startDate: "", endDate: ""}]})}>
            <Plus size={14} className="mr-1" /> Add
          </Button>
        </CardHeader>
        <CardContent className="p-6 space-y-4">
          {data.experience.map((exp: any, i: number) => (
            <div key={i} className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 border rounded-xl relative group">
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-slate-400 uppercase">Position</label>
                <Input value={exp.position} onChange={e => {
                  const n = [...data.experience]; n[i].position = e.target.value; setData({...data, experience: n})
                }} />
              </div>
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-slate-400 uppercase">Company</label>
                <Input value={exp.company} onChange={e => {
                  const n = [...data.experience]; n[i].company = e.target.value; setData({...data, experience: n})
                }} />
              </div>
              <Button variant="ghost" size="icon" className="absolute -top-2 -right-2 h-6 w-6 rounded-full bg-white border shadow-sm text-red-500 opacity-0 group-hover:opacity-100 transition-opacity" onClick={() => {
                const n = [...data.experience]; n.splice(i, 1); setData({...data, experience: n})
              }}><Trash2 size={12}/></Button>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* 4. Education */}
      <Card className="border-slate-200 shadow-sm">
        <CardHeader className="border-b bg-slate-50/30 flex flex-row items-center justify-between">
          <div className="flex items-center gap-2">
            <GraduationCap size={18} className="text-slate-400" />
            <CardTitle className="text-lg font-bold">Education</CardTitle>
          </div>
          <Button variant="outline" size="sm" onClick={() => setData({...data, education: [...data.education, {school: "", degree: "", grade: ""}]})}>
            <Plus size={14} className="mr-1" /> Add
          </Button>
        </CardHeader>
        <CardContent className="p-6 space-y-4">
          {data.education.map((edu: any, i: number) => (
            <div key={i} className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 border rounded-xl relative group">
              <div className="space-y-1 col-span-full">
                <label className="text-[10px] font-bold text-slate-400 uppercase">School / University</label>
                <Input value={edu.school} onChange={e => {
                  const n = [...data.education]; n[i].school = e.target.value; setData({...data, education: n})
                }} />
              </div>
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-slate-400 uppercase">Degree</label>
                <Input value={edu.degree} onChange={e => {
                  const n = [...data.education]; n[i].degree = e.target.value; setData({...data, education: n})
                }} />
              </div>
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-slate-400 uppercase">Grade (CGPA/%)</label>
                <Input value={edu.grade} onChange={e => {
                  const n = [...data.education]; n[i].grade = e.target.value; setData({...data, education: n})
                }} className="text-amber-600 font-bold" />
              </div>
              <Button variant="ghost" size="icon" className="absolute -top-2 -right-2 h-6 w-6 rounded-full bg-white border shadow-sm text-red-500 opacity-0 group-hover:opacity-100" onClick={() => {
                const n = [...data.education]; n.splice(i, 1); setData({...data, education: n})
              }}><Trash2 size={12}/></Button>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* 5. Projects */}
      <Card className="border-slate-200 shadow-sm">
        <CardHeader className="border-b bg-slate-50/30 flex flex-row items-center justify-between">
          <div className="flex items-center gap-2">
            <FolderKanban size={18} className="text-slate-400" />
            <CardTitle className="text-lg font-bold">Projects</CardTitle>
          </div>
          <Button variant="outline" size="sm" onClick={() => setData({...data, projects: [...data.projects, {title: "", description: "", link: ""}]})}>
            <Plus size={14} className="mr-1" /> Add
          </Button>
        </CardHeader>
        <CardContent className="p-6 space-y-4">
          {data.projects.map((proj: any, i: number) => (
            <div key={i} className="p-4 border rounded-xl relative group space-y-3">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-slate-400 uppercase">Title</label>
                  <Input value={proj.title} onChange={e => {
                    const n = [...data.projects]; n[i].title = e.target.value; setData({...data, projects: n})
                  }} />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-slate-400 uppercase">Link</label>
                  <Input value={proj.link} onChange={e => {
                    const n = [...data.projects]; n[i].link = e.target.value; setData({...data, projects: n})
                  }} />
                </div>
              </div>
              <div className="space-y-1">
                  <label className="text-[10px] font-bold text-slate-400 uppercase">Description</label>
                  <Textarea value={proj.description} onChange={e => {
                    const n = [...data.projects]; n[i].description = e.target.value; setData({...data, projects: n})
                  }} className="min-h-[60px]" />
              </div>
              <Button variant="ghost" size="icon" className="absolute -top-2 -right-2 h-6 w-6 rounded-full bg-white border shadow-sm text-red-500 opacity-0 group-hover:opacity-100" onClick={() => {
                const n = [...data.projects]; n.splice(i, 1); setData({...data, projects: n})
              }}><Trash2 size={12}/></Button>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Floating Save Button */}
      <div className="fixed bottom-8 right-8 z-50">
        <Button onClick={() => mutation.mutate()} disabled={mutation.isPending} className="bg-slate-900 gap-2 h-14 px-8 rounded-full shadow-2xl hover:scale-105 transition-transform">
          {mutation.isPending ? <Loader2 className="animate-spin h-5 w-5" /> : <Save size={20} />}
          <span className="font-bold uppercase tracking-widest text-xs">Save All Changes</span>
        </Button>
      </div>
    </div>
  );
}