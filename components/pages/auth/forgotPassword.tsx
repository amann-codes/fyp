"use client";

import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { forgotPasswordAction } from "@/actions/auth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Mail, Loader2, ArrowLeft } from "lucide-react";
import { toast } from "sonner";
import Link from "next/link";

export function ForgotPassword() {
    const [email, setEmail] = useState("");

    const mutation = useMutation({
        mutationFn: () => forgotPasswordAction(email),
        onSuccess: (res: any) => {
            if (res.success) toast.success(res.success);
            else toast.error(res.error);
        }
    });

    return (
        <Card className="w-full max-w-md shadow-2xl border-none">
            <CardHeader>
                <CardTitle className="text-2xl font-bold text-center">Reset Password</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
                <div className="relative">
                    <Mail className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
                    <Input
                        placeholder="Enter your email"
                        className="pl-10"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                    />
                </div>
                <Button
                    className="w-full bg-slate-900"
                    onClick={() => mutation.mutate()}
                    disabled={mutation.isPending}
                >
                    {mutation.isPending ? <Loader2 className="animate-spin" /> : "Send Reset Link"}
                </Button>
                <Link href="/signin" className="flex items-center justify-center text-sm text-slate-500 hover:text-slate-900">
                    <ArrowLeft className="mr-2 h-4 w-4" /> Back to Login
                </Link>
            </CardContent>
        </Card>
    );
}