import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import { syncReleasesFromGitHubAction } from "../../../lib/actions";
import { logger } from "../../../lib/logger";
import { withAuth } from "../../../lib/middleware";

export const POST = withAuth(async function POST(request: NextRequest) {
	try {
		const result = await syncReleasesFromGitHubAction();

		if (result.success) {
			logger.info(`Successfully synced ${result.syncedReleases} releases`);
			return NextResponse.json({
				success: true,
				message: result.message,
				syncedReleases: result.syncedReleases,
				timestamp: new Date().toISOString(),
			});
		}

		logger.error("Sync failed", { error: result.error });
		return NextResponse.json(
			{
				success: false,
				error: result.error,
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
});
