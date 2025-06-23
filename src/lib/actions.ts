"use server";

import { APP_CONFIG } from "./constants";
import {
	getLatestRelease,
	getReleasesFromDatabase,
	syncReleasesFromGitHub,
} from "./database";
import { GitHubApiError } from "./errors";
import { logger } from "./logger";
import type { GitHubRelease, Release } from "./types";

export async function getLatestVersion(): Promise<Release | null> {
	try {
		const latest = await getLatestRelease();

		if (latest) return latest;

		await syncReleasesFromGitHubAction();

		return null;
	} catch (error) {
		logger.error("Error getting latest version", error);
		return null;
	}
}

export async function getReleasesFromDB() {
	try {
		const releases = await getReleasesFromDatabase();

		return {
			success: true,
			releases,
		};
	} catch (error) {
		logger.error("Error fetching releases from database", error);
		return {
			success: false,
			error: error instanceof Error ? error.message : "Unknown error",
		};
	}
}

export async function syncReleasesFromGitHubAction() {
	try {
		const githubResponse = await fetch(
			`${APP_CONFIG.github.apiUrl}/repos/${APP_CONFIG.github.owner}/${APP_CONFIG.github.repo}/releases`,
		);
		if (!githubResponse.ok) {
			throw new GitHubApiError("Failed to fetch releases from GitHub");
		}

		const githubReleases: GitHubRelease[] = await githubResponse.json();

		const syncedCount = await syncReleasesFromGitHub(githubReleases);

		return {
			success: true,
			message: `Successfully synced ${syncedCount} releases`,
			syncedReleases: syncedCount,
		};
	} catch (error) {
		logger.error("Error syncing releases", error);
		return {
			success: false,
			error: error instanceof Error ? error.message : "Unknown error",
		};
	}
}

export async function getSyncStatus() {
	try {
		const githubResponse = await fetch(
			`${APP_CONFIG.github.apiUrl}/repos/${APP_CONFIG.github.owner}/${APP_CONFIG.github.repo}/releases`,
		);
		if (!githubResponse.ok) {
			throw new GitHubApiError("Failed to fetch releases from GitHub");
		}
		const githubReleases: GitHubRelease[] = await githubResponse.json();

		let dbReleases: Release[] = [];
		try {
			dbReleases = await getReleasesFromDatabase();
		} catch (dbError) {
			logger.warn("Database error in sync status check", dbError);
		}

		const needsSync = githubReleases.length !== dbReleases.length;
		logger.info(
			`Sync status: GitHub=${githubReleases.length}, DB=${dbReleases.length}, needsSync=${needsSync}`,
		);

		return {
			success: true,
			githubReleases: githubReleases.length,
			databaseReleases: dbReleases.length,
			needsSync,
			latestGitHubRelease: githubReleases[0]?.tag_name || "N/A",
			latestDatabaseRelease: dbReleases[0]?.tagName || "N/A",
		};
	} catch (error) {
		logger.error("Error getting sync status", error);
		return {
			success: false,
			error: error instanceof Error ? error.message : "Unknown error",
		};
	}
}

export async function getDownloadAsset(dbReleases: Release, platform: string) {
	try {
		const assets = dbReleases.assets as Array<{
			name: string;
			browser_download_url: string;
			size: number;
		}> | null;
		const asset = assets?.find((asset) => {
			const name = asset.name.toLowerCase();
			const platformConfig =
				APP_CONFIG.platforms[platform as keyof typeof APP_CONFIG.platforms];
			if (platformConfig) {
				return platformConfig.extensions.some((ext: string) =>
					name.includes(ext),
				);
			}
			return false;
		});

		if (asset) {
			return {
				success: true,
				asset,
				source: "database" as const,
			};
		}

		const githubResponse = await fetch(
			`${APP_CONFIG.github.apiUrl}/repos/${APP_CONFIG.github.owner}/${APP_CONFIG.github.repo}/releases/latest`,
		);
		if (githubResponse.ok) {
			const release = await githubResponse.json();
			const asset = release.assets.find((asset: { name: string }) => {
				const name = asset.name.toLowerCase();
				const platformConfig =
					APP_CONFIG.platforms[platform as keyof typeof APP_CONFIG.platforms];
				if (platformConfig) {
					return platformConfig.extensions.some((ext: string) =>
						name.includes(ext),
					);
				}
				return false;
			});

			if (asset) {
				logger.info(`Found GitHub asset for ${platform}: ${asset.name}`);
				return {
					success: true,
					asset,
					source: "github" as const,
				};
			}
		}

		logger.warn(`No suitable asset found for platform: ${platform}`);
		return {
			success: false,
			error: "No suitable asset found for platform",
		};
	} catch (error) {
		logger.error("Error getting download asset", error);
		return {
			success: false,
			error: error instanceof Error ? error.message : "Unknown error",
		};
	}
}
