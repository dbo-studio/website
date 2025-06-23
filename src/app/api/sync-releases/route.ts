import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import { syncReleasesFromGitHubAction } from "../../../lib/actions";
import { env } from "../../../lib/env";
import { logger } from "../../../lib/logger";

// تابع بررسی توکن
function validateToken(request: NextRequest): boolean {
	const authHeader = request.headers.get("authorization");

	if (!authHeader || !authHeader.startsWith("Bearer ")) {
		logger.warn("Missing or invalid authorization header");
		return false;
	}

	const token = authHeader.substring(7); // حذف 'Bearer '
	return token === env.API_SYNC_TOKEN;
}

export async function POST(request: NextRequest) {
	try {
		// بررسی توکن
		if (!validateToken(request)) {
			logger.warn("Unauthorized API access attempt");
			return NextResponse.json(
				{
					success: false,
					error: "Unauthorized",
					timestamp: new Date().toISOString(),
				},
				{ status: 401 },
			);
		}

		// دریافت اطلاعات release از GitHub Actions (اختیاری)
		const body = await request.json().catch(() => ({}));
		const { release_id, action, version } = body;

		logger.info(
			`GitHub Actions triggered sync: ${action || "manual"} ${release_id ? `for release ${release_id}` : ""} ${version ? `(v${version})` : ""}`,
		);

		// اجرای sync
		const result = await syncReleasesFromGitHubAction();

		if (result.success) {
			logger.info(`Successfully synced ${result.syncedReleases} releases`);
			return NextResponse.json({
				success: true,
				message: result.message,
				syncedReleases: result.syncedReleases,
				releaseInfo: { release_id, action, version },
				timestamp: new Date().toISOString(),
			});
		}

		logger.error("Sync failed", { error: result.error });
		return NextResponse.json(
			{
				success: false,
				error: result.error,
				releaseInfo: { release_id, action, version },
				timestamp: new Date().toISOString(),
			},
			{ status: 500 },
		);
	} catch (error) {
		logger.error("Error in sync-releases API", error);
		return NextResponse.json(
			{
				success: false,
				error: "Internal server error",
				timestamp: new Date().toISOString(),
			},
			{ status: 500 },
		);
	}
}

export async function GET(request: NextRequest) {
	try {
		// بررسی توکن
		if (!validateToken(request)) {
			return NextResponse.json(
				{
					success: false,
					error: "Unauthorized",
					timestamp: new Date().toISOString(),
				},
				{ status: 401 },
			);
		}

		const { getSyncStatus } = await import("../../../lib/actions");
		const result = await getSyncStatus();

		if (result.success) {
			return NextResponse.json({
				success: true,
				githubReleases: result.githubReleases,
				databaseReleases: result.databaseReleases,
				needsSync: result.needsSync,
				latestGitHubRelease: result.latestGitHubRelease,
				latestDatabaseRelease: result.latestDatabaseRelease,
				timestamp: new Date().toISOString(),
			});
		}

		return NextResponse.json(
			{
				success: false,
				error: result.error,
				timestamp: new Date().toISOString(),
			},
			{ status: 500 },
		);
	} catch (error) {
		console.error("Error in sync-releases status API:", error);
		return NextResponse.json(
			{
				success: false,
				error: "Internal server error",
				timestamp: new Date().toISOString(),
			},
			{ status: 500 },
		);
	}
}
