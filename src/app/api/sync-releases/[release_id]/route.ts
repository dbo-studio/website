import { APP_CONFIG } from "@/src/lib/constants";
import { upsertRelease } from "@/src/lib/database";
import { logger } from "@/src/lib/logger";
import { withAuth } from "@/src/lib/middleware";
import { NextResponse } from "next/server";

export const POST = withAuth(async function POST(
	request: Request,
	{ params }: { params: { release_id: string } },
) {
	try {
		const { release_id } = params;
		if (!release_id) {
			return NextResponse.json(
				{
					success: false,
					error: "release_id is required",
					timestamp: new Date().toISOString(),
				},
				{ status: 400 },
			);
		}
		const githubResponse = await fetch(
			`${APP_CONFIG.github.apiUrl}/repos/${APP_CONFIG.github.owner}/${APP_CONFIG.github.repo}/releases/${release_id}`,
		);
		if (!githubResponse.ok) {
			throw new Error("Failed to fetch release from GitHub");
		}
		const githubRelease = await githubResponse.json();
		await upsertRelease(githubRelease);
		logger.info(`Successfully synced release ${release_id}`);
		return NextResponse.json({
			success: true,
			message: `Successfully synced release ${release_id}`,
			releaseInfo: { release_id },
			timestamp: new Date().toISOString(),
		});
	} catch (error) {
		logger.error("Error in sync single release API", error);
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
