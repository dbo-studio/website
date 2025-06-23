export const APP_CONFIG = {
	name: "DBO Studio",
	version: "1.0.0",
	github: {
		owner: "dbo-studio",
		repo: "dbo",
		apiUrl: "https://api.github.com",
		repoUrl: "https://github.com/dbo-studio/dbo",
	},
	platforms: {
		macos: {
			name: "macOS",
			icon: "🍎",
			extensions: [".dmg", "macos", "darwin"],
		},
		windows: {
			name: "Windows",
			icon: "🪟",
			extensions: [".exe", "windows", "win"],
		},
		linux: {
			name: "Linux",
			icon: "🐧",
			extensions: [".AppImage", "linux", ".deb", ".rpm"],
		},
	},
	api: {
		endpoints: {
			sync: "/api/sync-releases",
			latest: "/api/latest-version",
		},
		timeout: 10000, // 10 seconds
	},
} as const;

export const ERROR_MESSAGES = {
	database: {
		connection: "Failed to connect to database",
		query: "Database query failed",
		sync: "Failed to sync releases",
	},
	api: {
		unauthorized: "Unauthorized access",
		notFound: "Resource not found",
		serverError: "Internal server error",
		timeout: "Request timeout",
	},
	github: {
		fetch: "Failed to fetch from GitHub",
		rateLimit: "GitHub API rate limit exceeded",
	},
} as const;

export const SUCCESS_MESSAGES = {
	sync: "Successfully synced releases",
	download: "Download started",
} as const;
