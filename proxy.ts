import NextAuth from "next-auth";
import { authOptions } from "./lib/auth.config";
import {
  publicRoutes,
  apiAuthPrefix,
  DEFAULT_LOGIN_REDIRECT,
  ONBOARDING_ROUTE
} from "./lib/routes";
import { NextResponse } from "next/server";

const { auth } = NextAuth(authOptions);

export default auth((req) => {
  const { nextUrl } = req;

  const isLoggedIn = !!req.auth;
  const isOnboarded = !!req.auth?.user?.onboarded;

  const isApiAuthRoute = nextUrl.pathname.startsWith(apiAuthPrefix);
  const isPublicRoute = publicRoutes.includes(nextUrl.pathname);
  const isOnboardingRoute = nextUrl.pathname === ONBOARDING_ROUTE;

  // 1. Allow API Authentication routes
  if (isApiAuthRoute) return NextResponse.next();

  // 2. Redirection Logic for Authenticated Users
  if (isLoggedIn) {
    // If logged in and trying to access Signin/Register
    if (isPublicRoute) {
      return NextResponse.redirect(new URL(DEFAULT_LOGIN_REDIRECT, nextUrl));
    }

    // If logged in but NOT onboarded, force to onboarding
    if (!isOnboarded && !isOnboardingRoute) {
      return NextResponse.redirect(new URL(ONBOARDING_ROUTE, nextUrl));
    }

    // If logged in and onboarded, block access to onboarding page
    if (isOnboarded && isOnboardingRoute) {
      return NextResponse.redirect(new URL(DEFAULT_LOGIN_REDIRECT, nextUrl));
    }

    return NextResponse.next();
  }

  // 3. Redirection Logic for Unauthenticated Users
  if (!isPublicRoute) {
    return NextResponse.redirect(new URL("/signin", nextUrl));
  }

  return NextResponse.next();
});

export const config = {
  matcher: ["/((?!.+\\.[\\w]+$|_next).*)", "/", "/(api|trpc)(.*)"],
};