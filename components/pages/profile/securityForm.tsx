"use client";

import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { updatePasswordAction } from "@/actions/profile";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";

export function SecurityForm() {
  const [passwords, setPasswords] = useState({ currentPassword: "", newPassword: "" });

  const mutation = useMutation({
    mutationFn: () => updatePasswordAction(passwords),
    onSuccess: (res: any) => {
      if (res.success) {
        toast.success(res.success);
        setPasswords({ currentPassword: "", newPassword: "" });
      } else toast.error(res.error);
    }
  });

  return (
    <Card className="border-slate-200 shadow-sm">
      <CardHeader className="border-b bg-slate-50/30">
        <CardTitle className="text-lg font-bold">Password & Security</CardTitle>
      </CardHeader>
      <CardContent className="p-6 space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-1.5">
            <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Current Password</label>
            <Input type="password" value={passwords.currentPassword} onChange={e => setPasswords({...passwords, currentPassword: e.target.value})} className="h-11" />
          </div>
          <div className="space-y-1.5">
            <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">New Password</label>
            <Input type="password" value={passwords.newPassword} onChange={e => setPasswords({...passwords, newPassword: e.target.value})} className="h-11" />
          </div>
        </div>
        <div className="pt-6 border-t flex justify-end">
          <Button onClick={() => mutation.mutate()} disabled={mutation.isPending} className="h-11 px-8">
            {mutation.isPending ? <Loader2 className="animate-spin h-4 w-4" /> : "Update Password"}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}