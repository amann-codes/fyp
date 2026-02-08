"use server";

import { db } from "@/lib/db";
import { onboardingSchema } from "@/lib/zod";
import { auth } from "@/lib/auth"; 
import { revalidatePath } from "next/cache";

export async function completeOnboardingAction(values: any) {
  const session = await auth();
  if (!session?.user?.email) return { error: "Unauthorized" };

  const validated = onboardingSchema.safeParse(values);
  if (!validated.success) return { error: validated.error.issues[0].message };

  try {
    await db.user.update({
      where: { email: session.user.email },
      data: {
        name: values.name,
        phoneNumber: values.phoneNumber,
        bio: values.bio,
        onboarded: true,
      },
    });

    revalidatePath("/");
    return { success: "Profile completed" };
  } catch (error) {
    return { error: "Failed to update profile" };
  }
}