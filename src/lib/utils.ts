import type { Platform, PlatformInfo, ReleaseAsset } from "./types";

// Platform configuration
export const PLATFORMS: PlatformInfo[] = [
	{
		id: "macos",
		name: "macOS",
		icon: "🍎",
		extensions: [".dmg", "macos", "darwin"],
	},
	{
		id: "windows",
		name: "Windows",
		icon: "🪟",
		extensions: [".exe", "windows", "win"],
	},
	{
		id: "linux",
		name: "Linux",
		icon: "🐧",
		extensions: [".AppImage", "linux", ".deb", ".rpm"],
	},
];

// Platform detection
export const detectPlatform = (): Platform | null => {
	const userAgent = navigator.userAgent.toLowerCase();

	if (userAgent.includes("mac")) return "macos";
	if (userAgent.includes("win")) return "windows";
	if (userAgent.includes("linux")) return "linux";

	return null;
};

// Asset filtering
export const getAssetForPlatform = (
	assets:
		| ReleaseAsset[]
		| Array<{
				name: string;
				browser_download_url: string;
				size: number;
				content_type: string;
		  }>
		| null,
	platform: Platform,
): ReleaseAsset | undefined => {
	if (!assets || !Array.isArray(assets)) return undefined;

	const platformInfo = PLATFORMS.find((p) => p.id === platform);
	if (!platformInfo) return undefined;

	return assets.find((asset) => {
		const name = asset.name.toLowerCase();
		return platformInfo.extensions.some((ext) => name.includes(ext));
	}) as ReleaseAsset | undefined;
};

// File size formatting
export const formatFileSize = (bytes: number): string => {
	const sizes = ["Bytes", "KB", "MB", "GB"];
	if (bytes === 0) return "0 Bytes";

	const i = Math.floor(Math.log(bytes) / Math.log(1024));
	return `${Math.round((bytes / 1024 ** i) * 100) / 100} ${sizes[i]}`;
};

// Platform utilities
export const getPlatformInfo = (
	platform: Platform,
): PlatformInfo | undefined => {
	return PLATFORMS.find((p) => p.id === platform);
};

export const getPlatformName = (platform: Platform): string => {
	return getPlatformInfo(platform)?.name || "Other";
};

export const getPlatformIcon = (platform: Platform): string => {
	return getPlatformInfo(platform)?.icon || "💻";
};

// Changelog parsing
export const parseChangelog = (body: string): string => {
	return body
		.replace(/#{1,6}\s+/g, "") // Remove headers
		.replace(/\*\*(.*?)\*\*/g, "$1") // Remove bold
		.replace(/\*(.*?)\*/g, "$1") // Remove italic
		.replace(/`(.*?)`/g, "$1") // Remove code
		.replace(/\[(.*?)\]\(.*?\)/g, "$1") // Remove links
		.trim();
};

// Date formatting
export const formatDate = (dateString: string): string => {
	return new Date(dateString).toLocaleDateString("fa-IR");
};
