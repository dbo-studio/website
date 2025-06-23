import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

export function middleware(request: NextRequest) {
	// Security headers
	const response = NextResponse.next();

	// Add security headers
	response.headers.set("X-Frame-Options", "DENY");
	response.headers.set("X-Content-Type-Options", "nosniff");
	response.headers.set("Referrer-Policy", "origin-when-cross-origin");
	response.headers.set("X-DNS-Prefetch-Control", "off");

	// Add CSP header for production
	if (process.env.NODE_ENV === "production") {
		response.headers.set(
			"Content-Security-Policy",
			"default-src 'self'; script-src 'self' 'unsafe-eval' 'unsafe-inline'; style-src 'self' 'unsafe-inline'; img-src 'self' data: https:; font-src 'self' data:; connect-src 'self' https://api.github.com;",
		);
	}

	return response;
}

export const config = {
	matcher: [
		/*
		 * Match all request paths except for the ones starting with:
		 * - api (API routes)
		 * - _next/static (static files)
		 * - _next/image (image optimization files)
		 * - favicon.ico (favicon file)
		 */
		"/((?!api|_next/static|_next/image|favicon.ico).*)",
	],
};
