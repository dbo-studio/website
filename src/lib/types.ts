// Types for GitHub releases
export interface ReleaseAsset {
	name: string;
	browser_download_url: string;
	size: number;
	content_type: string;
}

export interface GitHubRelease {
	id: number;
	tag_name: string;
	name: string;
	body: string;
	draft: boolean;
	prerelease: boolean;
	published_at: string;
	assets: ReleaseAsset[];
}

export interface GitHubAsset {
	id: number;
	name: string;
	browser_download_url: string;
	size: number;
	content_type: string;
}

// Database release type (matches Drizzle schema)
export interface DatabaseRelease {
	id: number;
	tagName: string;
	name: string | null;
	body: string | null;
	draft: boolean | null;
	prerelease: boolean | null;
	publishedAt: Date | null;
	assets: Array<{
		name: string;
		browser_download_url: string;
		size: number;
		content_type: string;
	}> | null;
	createdAt: Date | null;
	updatedAt: Date | null;
}

// Alias for backward compatibility
export type Release = DatabaseRelease;

// Platform types
export type Platform = "macos" | "windows" | "linux";

export interface PlatformInfo {
	id: Platform;
	name: string;
	icon: string;
	extensions: string[];
}

// API Response Types
export interface ApiResponse<T = unknown> {
	success: boolean;
	data?: T;
	error?: string;
	message?: string;
}

// Latest Version Response
export interface LatestVersionResponse {
	success: boolean;
	version?: string;
	name?: string;
	published_at?: string;
	source?: "database" | "github";
	error?: string;
}

// Sync Status Response
export interface SyncStatusResponse {
	success: boolean;
	githubReleases?: number;
	databaseReleases?: number;
	needsSync?: boolean;
	latestGitHubRelease?: string;
	latestDatabaseRelease?: string;
	error?: string;
}

// Download Asset Response
export interface DownloadAssetResponse {
	success: boolean;
	asset?: {
		name: string;
		browser_download_url: string;
		size: number;
	};
	source?: "database" | "github";
	error?: string;
}
