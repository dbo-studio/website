import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import { env } from "./env";

export function withAuth<T extends unknown[], R>(
	handler: (...args: T) => Promise<R>,
) {
	return async (...args: T) => {
		const request = args[0] as NextRequest;
		const authHeader = request.headers.get("authorization");
		if (!authHeader || !authHeader.startsWith("Bearer ")) {
			return NextResponse.json(
				{
					success: false,
					error: "Unauthorized",
					timestamp: new Date().toISOString(),
				},
				{ status: 401 },
			);
		}
		const token = authHeader.substring(7);
		if (token !== env.API_SYNC_TOKEN) {
			return NextResponse.json(
				{
					success: false,
					error: "Unauthorized",
					timestamp: new Date().toISOString(),
				},
				{ status: 401 },
			);
		}
		return handler(...args);
	};
}
