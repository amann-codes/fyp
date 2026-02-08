"use client";

import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { motion, AnimatePresence } from "framer-motion";
import { signIn } from "next-auth/react";
import { sendOtpAction, verifyOtpAction, finalizeSignupAction } from "@/actions/auth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Mail, Lock, ShieldCheck, Eye, EyeOff, Check, X, Loader2, Linkedin } from "lucide-react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import Link from "next/link";

export function RegistrationForm() {
  const [phase, setPhase] = useState<"email" | "otp" | "password">("email");
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const router = useRouter();

  const validations = [
    { label: "At least 8 characters", test: password.length >= 8 },
    { label: "Contains uppercase", test: /[A-Z]/.test(password) },
    { label: "Contains number", test: /[0-9]/.test(password) },
    { label: "Special character", test: /[^A-Za-z0-9]/.test(password) },
  ];

  const sendOtp = useMutation({
    mutationFn: () => sendOtpAction(email),
    onSuccess: (res) => {
      if (res.success) {
        setPhase("otp");
        toast.success("Verification code sent");
      } else toast.error(res.error);
    }
  });

  const verifyOtp = useMutation({
    mutationFn: () => verifyOtpAction(email, otp),
    onSuccess: (res) => {
      if (res.success) {
        setPhase("password");
        toast.success("Email verified");
      } else toast.error(res.error);
    }
  });

  const finalize = useMutation({
    mutationFn: () => finalizeSignupAction({ email, password }),
    onSuccess: (res) => {
      if (res.success) {
        toast.success("Account created successfully");
        router.push("/signin");
      } else toast.error(res.error);
    }
  });

  return (
    <Card className="w-full max-w-md shadow-2xl border-none bg-white/90 backdrop-blur-sm">
      <CardHeader>
        <CardTitle className="text-3xl font-bold text-center text-slate-800">
          Create Account
        </CardTitle>
      </CardHeader>
      <CardContent>
        <AnimatePresence mode="wait">
          {phase === "email" && (
            <motion.div key="email" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="space-y-4">
              <div className="relative">
                <Mail className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
                <Input
                  placeholder="Email Address"
                  className="pl-10 h-11"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
              <Button
                className="w-full bg-slate-900 h-11"
                onClick={() => sendOtp.mutate()}
                disabled={sendOtp.isPending}
              >
                {sendOtp.isPending ? <Loader2 className="animate-spin" /> : "Continue with Email"}
              </Button>

              <div className="relative py-2">
                <div className="absolute inset-0 flex items-center"><span className="w-full border-t border-slate-200" /></div>
                <div className="relative flex justify-center text-xs uppercase">
                  <span className="bg-white px-2 text-slate-500 font-medium">Or continue with</span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <Button
                  variant="outline"
                  className="h-11 border-slate-200 hover:bg-slate-50"
                  onClick={() => signIn("google", { callbackUrl: "/careers" })}
                >
                  <GoogleIcon className="mr-2 h-4 w-4" /> Google
                </Button>
                <Button
                  variant="outline"
                  className="h-11 border-slate-200 hover:bg-slate-50"
                  onClick={() => signIn("linkedin", { callbackUrl: "/careers" })}
                >
                  <Linkedin className="mr-2 h-4 w-4 text-[#0077B5]" /> LinkedIn
                </Button>
              </div>
            </motion.div>
          )}

          {phase === "otp" && (
            <motion.div key="otp" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-4">
              <p className="text-sm text-center text-slate-600">Enter the 6-digit code sent to <span className="font-semibold text-slate-900">{email}</span></p>
              <div className="relative">
                <ShieldCheck className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
                <Input
                  placeholder="Verification Code"
                  className="pl-10 h-11 text-center tracking-[0.5em] font-bold"
                  maxLength={6}
                  value={otp}
                  onChange={(e) => setOtp(e.target.value)}
                />
              </div>
              <Button
                className="w-full bg-slate-900 h-11"
                onClick={() => verifyOtp.mutate()}
                disabled={verifyOtp.isPending}
              >
                {verifyOtp.isPending ? <Loader2 className="animate-spin" /> : "Verify Code"}
              </Button>
              <button
                className="w-full text-xs text-slate-500 hover:underline"
                onClick={() => setPhase("email")}
              >
                Change Email Address
              </button>
            </motion.div>
          )}

          {phase === "password" && (
            <motion.div key="password" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="space-y-4">
              <div className="relative">
                <Lock className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
                <Input
                  type={showPassword ? "text" : "password"}
                  placeholder="Create Strong Password"
                  className="pl-10 pr-10 h-11"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-3 text-slate-400 hover:text-slate-600"
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
                className="w-full bg-slate-900 h-11"
                onClick={() => finalize.mutate()}
                disabled={finalize.isPending || !validations.every(v => v.test)}
              >
                {finalize.isPending ? <Loader2 className="animate-spin" /> : "Complete Registration"}
              </Button>
            </motion.div>
          )}
        </AnimatePresence>

        <div className="mt-8 text-center text-sm text-slate-500">
          Already have an account?{" "}
          <Link href="/signin" className="text-slate-900 font-bold hover:underline">
            Login
          </Link>
        </div>
      </CardContent>
    </Card>
  );
}

function GoogleIcon(props: any) {
  return (
    <svg viewBox="0 0 24 24" {...props}>
      <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" /><path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" /><path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" fill="#FBBC05" /><path d="M12 5.38c1.62 0 3.06.56 4.21 1.66l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
    </svg>
  );
}