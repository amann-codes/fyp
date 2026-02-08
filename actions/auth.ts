"use server";

import db from "@/lib/db";
import { sendEmail } from "@/lib/mail";
import bcrypt from "bcryptjs";
import { generatePasswordResetToken } from "@/actions/token";
import { otpSchema, passwordSchema } from "@/lib/zod";

export async function sendOtpAction(email: string) {
  try {
    const existingUser = await db.user.findUnique({ where: { email } });

    if (existingUser?.emailVerified) {
      return { error: "Email already in use. Please login." };
    }

    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const expires = new Date(Date.now() + 10 * 60 * 1000);

    await db.user.upsert({
      where: { email },
      update: { otp, otpExpires: expires },
      create: { email, otp, otpExpires: expires, onboarded: false },
    });

    await sendEmail({
      to: email,
      subject: "Verification Code",
      text: `Your code is ${otp}`,
    });

    return { success: true };
  } catch (error) {
    return { error: "Failed to process request" };
  }
}

export async function forgotPasswordAction(email: string) {
  const user = await db.user.findUnique({ where: { email } });
  if (!user || !user.password) return { error: "User not found" };

  const resetToken = await generatePasswordResetToken(email);
  const resetLink = `${process.env.NEXT_PUBLIC_APP_URL}/change-password?token=${resetToken.token}`;

  await sendEmail({
    to: email,
    subject: "Reset your password",
    text: `Click here to reset: ${resetLink}`,
  });

  return { success: "Reset link sent to your email" };
}

export async function resetPasswordAction(password: string, token: string) {
  try {
    const existingToken = await db.passwordResetToken.findUnique({
      where: { token }
    });

    if (!existingToken) return { error: "Invalid token" };

    const hasExpired = new Date(existingToken.expires) < new Date();
    if (hasExpired) return { error: "Token has expired" };

    const user = await db.user.findUnique({
      where: { email: existingToken.email }
    });

    if (!user) return { error: "Email does not exist" };

    const hashedPassword = await bcrypt.hash(password, 10);

    await db.user.update({
      where: { id: user.id },
      data: { password: hashedPassword }
    });

    await db.passwordResetToken.delete({
      where: { id: existingToken.id }
    });

    return { success: "Password updated" };
  } catch (error) {
    return { error: "Something went wrong" };
  }
}

export async function verifyOtpAction(email: string, code: string) {
  const validated = otpSchema.safeParse({ email, code });
  if (!validated.success) return { error: validated.error.issues[0].message };

  const user = await db.user.findUnique({ where: { email } });

  if (!user || user.otp !== code || !user.otpExpires || user.otpExpires < new Date()) {
    console.log(user, user?.otp, user?.otpExpires)
    return { error: "Invalid or expired OTP" };
  }

  return { success: "OTP verified" };
}

export async function finalizeSignupAction(values: any) {
  const validated = passwordSchema.safeParse(values);
  if (!validated.success) return { error: validated.error.issues[0].message };

  const hashedPassword = await bcrypt.hash(values.password, 10);

  try {
    await db.user.update({
      where: { email: values.email },
      data: {
        password: hashedPassword,
        emailVerified: new Date(),
        otp: null,
        otpExpires: null,
      },
    });
    return { success: "Account created successfully" };
  } catch (error) {
    return { error: "Failed to set password" };
  }
}
