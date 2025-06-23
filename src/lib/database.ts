import { desc, eq } from "drizzle-orm";
import { type NodePgDatabase, drizzle } from "drizzle-orm/node-postgres";
import { DatabaseError } from "./errors";
import { logger } from "./logger";
import { type Release, releases } from "./schema";
import type { GitHubRelease } from "./types";

export async function getDatabase(): Promise<NodePgDatabase> {
	return drizzle(process.env.DATABASE_URL as string);
}

export async function getReleasesFromDatabase() {
	try {
		const database = await getDatabase();
		const result = await database
			.select()
			.from(releases)
			.orderBy(desc(releases.publishedAt))
			.limit(50);

		logger.info(`Fetched ${result.length} releases from database`);
		return result;
	} catch (error) {
		logger.error("Error fetching releases from database", error);
		throw new DatabaseError("Failed to fetch releases from database");
	}
}

export async function upsertRelease(githubRelease: GitHubRelease) {
	try {
		const database = await getDatabase();

		const releaseData = {
			id: githubRelease.id,
			tagName: githubRelease.tag_name,
			name: githubRelease.name,
			body: githubRelease.body,
			draft: githubRelease.draft,
			prerelease: githubRelease.prerelease,
			publishedAt: githubRelease.published_at
				? new Date(githubRelease.published_at)
				: null,
			assets: githubRelease.assets,
			updatedAt: new Date(),
		};

		await database
			.insert(releases)
			.values(releaseData)
			.onConflictDoUpdate({
				target: releases.id,
				set: {
					tagName: releaseData.tagName,
					name: releaseData.name,
					body: releaseData.body,
					draft: releaseData.draft,
					prerelease: releaseData.prerelease,
					publishedAt: releaseData.publishedAt,
					assets: releaseData.assets,
					updatedAt: releaseData.updatedAt,
				},
			});

		logger.debug(`Upserted release: ${releaseData.tagName}`);
		return true;
	} catch (error) {
		logger.error("Error upserting release", error);
		throw new DatabaseError("Failed to upsert release");
	}
}

export async function syncReleasesFromGitHub(githubReleases: GitHubRelease[]) {
	try {
		const database = await getDatabase();

		let syncedCount = 0;
		for (const release of githubReleases) {
			await upsertRelease(release);
			syncedCount++;
		}

		logger.info(`Successfully synced ${syncedCount} releases`);
		return syncedCount;
	} catch (error) {
		logger.error("Error syncing releases", error);
		throw new DatabaseError("Failed to sync releases");
	}
}

export async function getLatestRelease(): Promise<Release | null> {
	try {
		const database = await getDatabase();
		const result = await database
			.select()
			.from(releases)
			.where(eq(releases.draft, false))
			.orderBy(desc(releases.publishedAt))
			.limit(1);

		const latest = result[0] || null;
		logger.debug(`Latest release: ${latest?.tagName || "none"}`);
		return latest;
	} catch (error) {
		logger.error("Error fetching latest release", error);
		throw new DatabaseError("Failed to fetch latest release");
	}
}

export async function getReleaseByTag(tagName: string) {
	try {
		const database = await getDatabase();
		const result = await database
			.select()
			.from(releases)
			.where(eq(releases.tagName, tagName))
			.limit(1);

		const release = result[0] || null;
		logger.debug(
			`Release by tag ${tagName}: ${release ? "found" : "not found"}`,
		);
		return release;
	} catch (error) {
		logger.error("Error fetching release by tag", error);
		throw new DatabaseError("Failed to fetch release by tag");
	}
}

export async function getReleasesCount() {
	try {
		const database = await getDatabase();
		const result = await database.select({ count: releases.id }).from(releases);

		return result.length;
	} catch (error) {
		logger.error("Error counting releases", error);
		throw new DatabaseError("Failed to count releases");
	}
}
