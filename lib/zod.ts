import { z } from "zod";

export const signupSchema = z.object({
  email: z.string().email("Invalid email address"),
});

export const otpSchema = z.object({
  email: z.string().email(),
  code: z.string().length(6, "OTP must be 6 digits"),
});

export const passwordSchema = z.object({
  email: z.string().email(),
  password: z
    .string()
    .min(8, "Password must be at least 8 characters")
    .regex(/[A-Z]/, "Must contain at least one uppercase letter")
    .regex(/[a-z]/, "Must contain at least one lowercase letter")
    .regex(/[0-9]/, "Must contain at least one number")
    .regex(/[^A-Za-z0-9]/, "Must contain at least one special character"),
});

export const onboardingSchema = z.object({
  name: z.string().min(2, "Name is too short"),
  phoneNumber: z.string().min(10, "Invalid phone number"),
  bio: z.string().min(10, "Bio must be at least 10 characters"),
});