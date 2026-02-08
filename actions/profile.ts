"use server";

import db from "@/lib/db";
import { auth, signOut } from "@/lib/auth";
import { revalidatePath } from "next/cache";
import bcrypt from "bcryptjs";

export async function updateProfileAction(data: any) {
  const session = await auth();
  if (!session?.user?.id) return { error: "Unauthorized" };

  try {
    await db.user.update({
      where: { id: session.user.id },
      data: {
        name: data.name || "",
        bio: data.bio || "",
        onboarded: true,
        skills: {
          deleteMany: {},
          create: (data.skills || []).map((s: string) => ({ name: s })),
        },
        education: {
          deleteMany: {},
          create: (data.education || []).map((edu: any) => ({
            school: edu.school || "",
            degree: edu.degree || "",
            field: edu.field || "",
            startYear: edu.startYear || "",
            endYear: edu.endYear || "",
            grade: edu.grade || "",
          })),
        },
        experience: {
          deleteMany: {},
          create: (data.experience || []).map((exp: any) => ({
            company: exp.company || "",
            position: exp.position || "",
            description: exp.description || "",
            startDate: exp.startDate || "",
            endDate: exp.endDate || "",
          })),
        },
        projects: {
          deleteMany: {},
          create: (data.projects || []).map((p: any) => ({
            title: p.title || "",
            description: p.description || "",
            link: p.link || "",
          })),
        },
      },
    });

    revalidatePath("/profile");
    revalidatePath("/careers");
    return { success: true };
  } catch (error) {
    return { error: "Failed to save profile." };
  }
}

export async function updatePasswordAction(data: any) {
  const session = await auth();
  if (!session?.user?.id) return { error: "Unauthorized" };

  try {
    const user = await db.user.findUnique({ where: { id: session.user.id } });
    if (!user || !user.password) return { error: "User not found" };

    const passwordsMatch = await bcrypt.compare(data.currentPassword, user.password);
    if (!passwordsMatch) return { error: "Current password incorrect" };

    const hashedPassword = await bcrypt.hash(data.newPassword, 10);
    await db.user.update({
      where: { id: session.user.id },
      data: { password: hashedPassword },
    });

    return { success: "Password updated successfully" };
  } catch (error) {
    return { error: "Failed to update password" };
  }
}

export async function deleteProfileAction() {
  const session = await auth();
  if (!session?.user?.id) return { error: "Unauthorized" };

  try {
    await db.user.delete({ where: { id: session.user.id } });
    await signOut({ redirectTo: "/signin" });
    return { success: true };
  } catch (error) {
    return { error: "Failed to delete account" };
  }
}