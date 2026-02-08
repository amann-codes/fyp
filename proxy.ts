import NextAuth from "next-auth";
import authConfig from "@/lib/auth.config";
import { DEFAULT_LOGIN_REDIRECT, apiAuthPrefix, publicRoutes } from "@/lib/routes";

const { auth } = NextAuth(authConfig);

export default auth((req) => {
  const { nextUrl } = req;
  const isLoggedIn = !!req.auth;
  const user = req.auth?.user as any;
  const isOnboarded = user?.onboarded;

  const isApiAuthRoute = nextUrl.pathname.startsWith(apiAuthPrefix);
  const isPublicRoute = publicRoutes.includes(nextUrl.pathname);
  const isOnboardingPage = nextUrl.pathname === "/onboarding";

  if (isApiAuthRoute) return;

  if (isPublicRoute) {
    if (isLoggedIn) {
      const isAuthPage = nextUrl.pathname === "/signin" || nextUrl.pathname === "/register";
      if (isAuthPage) {
        return Response.redirect(new URL(isOnboarded ? DEFAULT_LOGIN_REDIRECT : "/onboarding", nextUrl));
      }
    }
    return;
  }

  if (!isLoggedIn) {
    return Response.redirect(new URL("/signin", nextUrl));
  }

  if (isOnboardingPage) {
    if (isOnboarded) return Response.redirect(new URL(DEFAULT_LOGIN_REDIRECT, nextUrl));
    return;
  }

  if (!isOnboarded) {
    return Response.redirect(new URL("/onboarding", nextUrl));
  }

  return;
});

export const config = {
  matcher: ["/((?!.+\\.[\\w]+$|_next).*)", "/", "/(api|trpc)(.*)"],
};