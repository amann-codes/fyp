"use client";

import { useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { useMutation } from "@tanstack/react-query";
import { resetPasswordAction } from "@/actions/auth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Lock, Eye, EyeOff, Check, X, Loader2 } from "lucide-react";
import { toast } from "sonner";

export function ResetPassword() {
    const searchParams = useSearchParams();
    const router = useRouter();
    const token = searchParams.get("token");

    const [password, setPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);

    const validations = [
        { label: "At least 8 characters", test: password.length >= 8 },
        { label: "Contains uppercase", test: /[A-Z]/.test(password) },
        { label: "Contains number", test: /[0-9]/.test(password) },
        { label: "Special character", test: /[^A-Za-z0-9]/.test(password) },
    ];

    const mutation = useMutation({
        mutationFn: () => resetPasswordAction(password, token || ""),
        onSuccess: (res: any) => {
            if (res.success) {
                toast.success("Password reset successfully");
                router.push("/signin");
            } else {
                toast.error(res.error);
            }
        }
    });

    if (!token) return <div className="text-center p-10">Invalid reset link.</div>;

    return (
        <Card className="w-full max-w-md shadow-2xl border-none">
            <CardHeader>
                <CardTitle className="text-2xl font-bold text-center">New Password</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
                <div className="relative">
                    <Lock className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
                    <Input
                        type={showPassword ? "text" : "password"}
                        placeholder="Enter new password"
                        className="pl-10 pr-10"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                    />
                    <button
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-3 text-slate-400"
                    >
                        {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                </div>

                <div className="grid grid-cols-2 gap-2 p-3 bg-slate-50 rounded-lg text-[11px]">
                    {validations.map((v, i) => (
                        <div key={i} className={`flex items-center gap-1.5 ${v.test ? "text-green-600" : "text-slate-400"}`}>
                            {v.test ? <Check size={12} strokeWidth={3} /> : <X size={12} strokeWidth={3} />} {v.label}
                        </div>
                    ))}
                </div>

                <Button
                    className="w-full bg-slate-900"
                    onClick={() => mutation.mutate()}
                    disabled={mutation.isPending || !validations.every(v => v.test)}
                >
                    {mutation.isPending ? <Loader2 className="animate-spin" /> : "Reset Password"}
                </Button>
            </CardContent>
        </Card>
    );
}