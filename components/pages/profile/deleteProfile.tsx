"use client";

import { useMutation } from "@tanstack/react-query";
import { deleteProfileAction } from "@/actions/profile";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";

export function DeleteProfile() {
  const mutation = useMutation({
    mutationFn: () => deleteProfileAction(),
    onSuccess: () => toast.success("Account deleted"),
  });

  const handleDelete = () => {
    if (confirm("Permanently delete your profile? This cannot be undone.")) {
      mutation.mutate();
    }
  };

  return (
    <Card className="border-red-200 shadow-sm overflow-hidden">
      <div className="p-6 space-y-2">
        <h3 className="text-xl font-bold text-slate-900">Delete Account</h3>
        <p className="text-sm text-slate-500 max-w-2xl">
          Permanently delete your professional profile and all data associated with it. 
          This includes your projects, work history, and skills.
        </p>
      </div>
      
      <div className="bg-red-50/50 border-t border-red-100 p-4 flex justify-end">
        <Button 
          variant="destructive" 
          onClick={handleDelete}
          disabled={mutation.isPending}
          className="bg-red-600 hover:bg-red-700 h-10 px-6 font-bold text-xs uppercase tracking-widest"
        >
          {mutation.isPending ? <Loader2 className="animate-spin h-4 w-4" /> : "Delete Profile"}
        </Button>
      </div>
    </Card>
  );
}