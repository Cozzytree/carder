import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
   const session = request.cookies.get(
      process.env.NEXT_PUBLIC_SESSION_NAME || "",
   );
   const pathname = request.nextUrl.pathname;

   // If no session and not already on /landing, redirect to /landing
   if (!session?.value && pathname !== "/landing") {
      return NextResponse.redirect(new URL("/landing", request.url));
   }

   // If session exists and user is trying to access /landing, redirect to /
   if (session?.value && pathname === "/landing") {
      return NextResponse.redirect(new URL("/", request.url));
   }

   // Otherwise, let the request continue
   return NextResponse.next();
}

export const config = {
   matcher: ["/", "/landing"],
};
