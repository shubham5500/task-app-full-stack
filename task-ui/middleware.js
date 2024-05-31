import { redirect } from "next/navigation";
import { NextRequest, NextResponse } from "next/server";

export function middleware(request) {
  const token = request.cookies.get("token");
  // If no token, redirect to the login page
  if (!token) {
    // redirect('/auth')
    return NextResponse.redirect(new URL("/auth", request.url));
  }
  return NextResponse.next();
}
export const config = {
  matcher: ["/board"],
};
