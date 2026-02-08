"use client";

import { useState, useMemo } from "react";
import { useMutation } from "@tanstack/react-query";
import { motion, AnimatePresence } from "framer-motion";
import { updateProfileAction } from "@/actions/profile";
import { parseResumeAction } from "@/actions/resume";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Loader2, Upload, Plus, Trash2, Sparkles, CheckCircle2,
  GraduationCap, Briefcase, Link as FolderKanban
} from "lucide-react";
import { toast } from "sonner";

export function OnboardingForm() {
  const [step, setStep] = useState(1);
  const [isParsing, setIsParsing] = useState(false);
  const [profile, setProfile] = useState({
    name: "",
    bio: "",
    skills: [] as string[],
    education: [] as any[],
    experience: [] as any[],
    projects: [] as any[]
  });

  const completeness = useMemo(() => {
    let score = 0;
    if (profile.name) score += 20;
    if (profile.bio) score += 20;
    if (profile.skills.length > 0) score += 20;
    if (profile.education.length > 0) score += 10;
    if (profile.experience.length > 0) score += 10;
    if (profile.projects.length > 0) score += 20;
    return Math.min(score, 100);
  }, [profile]);

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setIsParsing(true);
    const formData = new FormData();
    formData.append("file", file);
    const res = await parseResumeAction(formData);
    if (res.success && res.data) {
      setProfile((prev) => ({ ...prev, ...res.data }));
      toast.success("AI parsed and generated your profile!");
    } else toast.error(res.error || "Parsing failed");
    setIsParsing(false);
  };

  const mutation = useMutation({
    mutationFn: () => updateProfileAction(profile),
    onSuccess: (res) => {
      if (res.success) {
        toast.success("Welcome aboard!");
        window.location.href = "/careers";
      } else toast.error(res.error);
    }
  });

  const totalSteps = 5;

  return (
    <Card className="w-full max-w-3xl border-none shadow-2xl bg-white/90 backdrop-blur-md overflow-hidden">
      <div className="h-1.5 w-full bg-slate-100">
        <motion.div className="h-full bg-slate-900" animate={{ width: `${(step / totalSteps) * 100}%` }} />
      </div>
      <CardHeader className="pt-8 px-8 flex flex-row justify-between items-end">
        <div>
          <CardTitle className="text-2xl font-bold text-slate-900">
            {step === 1 && "Personal Information"}
            {step === 2 && "Work Experience"}
            {step === 3 && "Education Details"}
            {step === 4 && "Key Projects"}
            {step === 5 && "Skills"}
          </CardTitle>
          <p className="text-slate-500 text-sm">Completeness: {completeness}%</p>
        </div>
        <span className="text-xs font-bold px-3 py-1 bg-slate-900 text-white rounded-full">STEP {step}/{totalSteps}</span>
      </CardHeader>

      <CardContent className="p-8">
        <AnimatePresence mode="wait">
          {step === 1 && (
            <motion.div key="s1" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="space-y-6">
              <div className="relative border-2 border-dashed rounded-2xl p-8 text-center hover:bg-slate-50 transition-all border-slate-200 bg-slate-50/30">
                <input type="file" className="absolute inset-0 opacity-0 cursor-pointer" onChange={handleFileUpload} accept=".pdf" disabled={isParsing} />
                {isParsing ? (
                  <div className="flex flex-col items-center gap-2">
                    <Loader2 className="animate-spin text-slate-900 w-8 h-8" />
                    <p className="text-sm font-bold animate-pulse">Gemini AI is analyzing your resume...</p>
                  </div>
                ) : (
                  <div className="space-y-2">
                    <Upload className="w-8 h-8 mx-auto text-slate-400" />
                    <p className="text-sm font-bold text-slate-800">Autofill with Resume PDF</p>
                    <p className="text-xs text-slate-400 flex items-center justify-center gap-1"><Sparkles className="w-3 h-3 text-blue-500" /> Powered by AI</p>
                  </div>
                )}
              </div>
              <div className="space-y-4">
                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">Full Name</label>
                  <Input placeholder="Enter your name" value={profile.name} onChange={e => setProfile({ ...profile, name: e.target.value })} className="h-12" />
                </div>
                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">Professional Bio</label>
                  <Textarea placeholder="Briefly describe your background..." value={profile.bio} onChange={e => setProfile({ ...profile, bio: e.target.value })} className="min-h-[140px] resize-none" />
                </div>
              </div>
            </motion.div>
          )}

          {step === 2 && (
            <motion.div key="s2" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-4">
              {profile.experience.map((exp: any, i: number) => (
                <Card key={i} className="border-slate-200 shadow-sm bg-white">
                  <div className="bg-slate-50 px-4 py-2 border-b flex justify-between items-center">
                    <div className="flex items-center gap-2 text-slate-500 font-bold text-[10px] uppercase"><Briefcase size={12} /> Experience #{i + 1}</div>
                    <Button variant="ghost" size="icon" className="h-6 w-6 text-red-400 hover:bg-red-50" onClick={() => {
                      const n = [...profile.experience]; n.splice(i, 1); setProfile({ ...profile, experience: n })
                    }}><Trash2 size={14} /></Button>
                  </div>
                  <CardContent className="p-4 grid grid-cols-2 gap-4">
                    <div className="space-y-1"><label className="text-[10px] font-bold text-slate-400 uppercase">Position</label><Input value={exp.position} onChange={e => {
                      const n = [...profile.experience]; n[i].position = e.target.value; setProfile({ ...profile, experience: n })
                    }} className="h-10" /></div>
                    <div className="space-y-1"><label className="text-[10px] font-bold text-slate-400 uppercase">Company</label><Input value={exp.company} onChange={e => {
                      const n = [...profile.experience]; n[i].company = e.target.value; setProfile({ ...profile, experience: n })
                    }} className="h-10" /></div>
                    <div className="space-y-1"><label className="text-[10px] font-bold text-slate-400 uppercase">Start Date</label><Input value={exp.startDate} onChange={e => {
                      const n = [...profile.experience]; n[i].startDate = e.target.value; setProfile({ ...profile, experience: n })
                    }} className="h-10" /></div>
                    <div className="space-y-1"><label className="text-[10px] font-bold text-slate-400 uppercase">End Date</label><Input value={exp.endDate} onChange={e => {
                      const n = [...profile.experience]; n[i].endDate = e.target.value; setProfile({ ...profile, experience: n })
                    }} className="h-10" /></div>
                  </CardContent>
                </Card>
              ))}
              <Button variant="outline" className="w-full border-dashed py-6 text-slate-500" onClick={() => setProfile({ ...profile, experience: [...profile.experience, { company: "", position: "", startDate: "", endDate: "" }] })}><Plus size={14} className="mr-2" />Add Experience</Button>
            </motion.div>
          )}

          {step === 3 && (
            <motion.div key="s3" className="space-y-4">
              {profile.education.map((edu: any, i: number) => (
                <Card key={i} className="border-slate-200 shadow-sm bg-white">
                  <div className="bg-slate-50 px-4 py-2 border-b flex justify-between items-center">
                    <div className="flex items-center gap-2 text-slate-500 font-bold text-[10px] uppercase"><GraduationCap size={12} /> Education #{i + 1}</div>
                    <Button variant="ghost" size="icon" className="h-6 w-6 text-red-400 hover:bg-red-50" onClick={() => {
                      const n = [...profile.education]; n.splice(i, 1); setProfile({ ...profile, education: n })
                    }}><Trash2 size={14} /></Button>
                  </div>
                  <CardContent className="p-4 space-y-4">
                    <div className="space-y-1"><label className="text-[10px] font-bold text-slate-400 uppercase">School / University</label><Input value={edu.school} onChange={e => {
                      const n = [...profile.education]; n[i].school = e.target.value; setProfile({ ...profile, education: n })
                    }} className="h-10" /></div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-1"><label className="text-[10px] font-bold text-slate-400 uppercase">Degree</label><Input value={edu.degree} onChange={e => {
                        const n = [...profile.education]; n[i].degree = e.target.value; setProfile({ ...profile, education: n })
                      }} className="h-10" /></div>
                      <div className="space-y-1"><label className="text-[10px] font-bold text-slate-400 uppercase">Grade (CGPA/%)</label><Input value={edu.grade} className="font-bold text-amber-600 h-10 border-amber-100 bg-amber-50/30" onChange={e => {
                        const n = [...profile.education]; n[i].grade = e.target.value; setProfile({ ...profile, education: n })
                      }} /></div>
                    </div>
                  </CardContent>
                </Card>
              ))}
              <Button variant="outline" className="w-full border-dashed py-6 text-slate-500" onClick={() => setProfile({ ...profile, education: [...profile.education, { school: "", degree: "", grade: "" }] })}><Plus size={14} className="mr-2" />Add Education Entry</Button>
            </motion.div>
          )}

          {step === 4 && (
            <motion.div key="s4" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-4">
              {profile.projects.map((proj: any, i: number) => (
                <Card key={i} className="border-slate-200 shadow-sm bg-white">
                  <div className="bg-slate-50 px-4 py-2 border-b flex justify-between items-center">
                    <div className="flex items-center gap-2 text-slate-500 font-bold text-[10px] uppercase"><FolderKanban size={12} /> Project #{i + 1}</div>
                    <Button variant="ghost" size="icon" className="h-6 w-6 text-red-400 hover:bg-red-50" onClick={() => {
                      const n = [...profile.projects]; n.splice(i, 1); setProfile({ ...profile, projects: n })
                    }}><Trash2 size={14} /></Button>
                  </div>
                  <CardContent className="p-4 space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-1"><label className="text-[10px] font-bold text-slate-400 uppercase">Project Title</label><Input value={proj.title} onChange={e => {
                        const n = [...profile.projects]; n[i].title = e.target.value; setProfile({ ...profile, projects: n })
                      }} className="h-10" /></div>
                      <div className="space-y-1"><label className="text-[10px] font-bold text-slate-400 uppercase">Link (Optional)</label><Input value={proj.link} placeholder="GitHub/Demo URL" onChange={e => {
                        const n = [...profile.projects]; n[i].link = e.target.value; setProfile({ ...profile, projects: n })
                      }} className="h-10" /></div>
                    </div>
                    <div className="space-y-1"><label className="text-[10px] font-bold text-slate-400 uppercase">Short Description</label><Textarea value={proj.description} onChange={e => {
                      const n = [...profile.projects]; n[i].description = e.target.value; setProfile({ ...profile, projects: n })
                    }} className="min-h-20" /></div>
                  </CardContent>
                </Card>
              ))}
              <Button variant="outline" className="w-full border-dashed py-6 text-slate-500" onClick={() => setProfile({ ...profile, projects: [...profile.projects, { title: "", description: "", link: "" }] })}><Plus size={14} className="mr-2" />Add Project</Button>
            </motion.div>
          )}

          {step === 5 && (
            <motion.div key="s5" className="space-y-6">
              <div className="space-y-3">
                <label className="text-[10px] font-bold uppercase text-slate-400 tracking-widest ml-1">Top Skills</label>
                <div className="flex flex-wrap gap-2 p-4 border rounded-2xl bg-slate-50/50">
                  {profile.skills.map((s, i) => (
                    <span key={i} className="bg-slate-900 text-white px-3 py-1.5 rounded-full text-xs font-medium flex items-center gap-2">
                      {s} <X size={12} className="cursor-pointer" onClick={() => {
                        const n = [...profile.skills]; n.splice(i, 1); setProfile({ ...profile, skills: n })
                      }} />
                    </span>
                  ))}
                  <Input placeholder="Add skill..." className="w-32 h-8 text-xs border-none bg-transparent focus-visible:ring-0" onKeyDown={(e: any) => {
                    if (e.key === 'Enter' && e.target.value) {
                      setProfile({ ...profile, skills: [...profile.skills, e.target.value] }); e.target.value = "";
                    }
                  }} />
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <div className="flex justify-between mt-12 pt-6 border-t border-slate-100">
          <Button variant="ghost" disabled={step === 1} onClick={() => setStep(step - 1)} className="text-slate-500">Back</Button>
          <div className="flex gap-3">
            {step < totalSteps ? (
              <Button onClick={() => setStep(step + 1)} className="bg-slate-900 px-10 h-11">Continue</Button>
            ) : (
              <Button onClick={() => mutation.mutate()} disabled={mutation.isPending} className="bg-green-600 hover:bg-green-700 px-10 h-11 text-white shadow-lg shadow-green-100">
                {mutation.isPending ? <Loader2 className="animate-spin mr-2 h-4 w-4" /> : <CheckCircle2 className="mr-2 h-4 w-4" />} Finish Setup
              </Button>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

function X({ size, className, onClick }: { size: number, className?: string, onClick?: () => void }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" className={className} onClick={onClick}>
      <path d="M18 6 6 18" /><path d="m6 6 12 12" />
    </svg>
  );
}