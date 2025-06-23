"use client";

import { useEffect, useState } from "react";
import { getReleasesFromDB } from "../../../lib/actions";
import type { DatabaseRelease } from "../../../lib/types";

export default function DatabaseReleases() {
	const [releases, setReleases] = useState<DatabaseRelease[]>([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState<string>("");

	useEffect(() => {
		async function fetchReleases() {
			try {
				setLoading(true);
				const result = await getReleasesFromDB();

				if (result.success && result.releases) {
					setReleases(result.releases);
				} else {
					setError(result.error || "Failed to fetch releases");
				}
			} catch (err) {
				console.error("Error fetching releases:", err);
				setError("Failed to fetch releases");
			} finally {
				setLoading(false);
			}
		}

		fetchReleases();
	}, []);

	const formatDate = (date: Date | null) => {
		if (!date) return "Unknown date";
		return date.toLocaleDateString("fa-IR", {
			year: "numeric",
			month: "long",
			day: "numeric",
		});
	};

	const getAssetForPlatform = (assets: unknown, platform: string) => {
		if (!assets || !Array.isArray(assets)) return null;

		return (
			assets as Array<{
				name: string;
				browser_download_url: string;
				size: number;
			}>
		).find((asset) => {
			const name = asset.name.toLowerCase();
			if (platform === "macos") {
				return (
					name.includes(".dmg") ||
					name.includes("macos") ||
					name.includes("darwin")
				);
			}
			if (platform === "windows") {
				return (
					name.includes(".exe") ||
					name.includes("windows") ||
					name.includes("win")
				);
			}
			if (platform === "linux") {
				return (
					name.includes(".AppImage") ||
					name.includes("linux") ||
					name.includes(".deb") ||
					name.includes(".rpm")
				);
			}
			return false;
		});
	};

	const getPlatformName = (platform: string) => {
		switch (platform) {
			case "macos":
				return "macOS";
			case "windows":
				return "Windows";
			case "linux":
				return "Linux";
			default:
				return platform;
		}
	};

	if (loading) {
		return (
			<div className="space-y-4">
				{[1, 2, 3].map((i) => (
					<div
						key={i}
						className="bg-white border border-gray-200 rounded-lg p-6 animate-pulse"
					>
						<div className="h-6 bg-gray-200 rounded w-1/3 mb-2" />
						<div className="h-4 bg-gray-200 rounded w-1/4 mb-4" />
						<div className="space-y-2">
							<div className="h-4 bg-gray-200 rounded w-full" />
							<div className="h-4 bg-gray-200 rounded w-3/4" />
						</div>
					</div>
				))}
			</div>
		);
	}

	if (error) {
		return (
			<div className="bg-red-50 border border-red-200 rounded-lg p-6">
				<div className="flex items-center">
					<svg
						className="w-5 h-5 text-red-400 mr-2"
						fill="currentColor"
						viewBox="0 0 20 20"
						aria-hidden="true"
					>
						<path
							fillRule="evenodd"
							d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
							clipRule="evenodd"
						/>
					</svg>
					<span className="text-red-800">{error}</span>
				</div>
			</div>
		);
	}

	if (releases.length === 0) {
		return (
			<div className="bg-gray-50 border border-gray-200 rounded-lg p-6 text-center">
				<p className="text-gray-600">هیچ ریلیزی در دیتابیس یافت نشد</p>
			</div>
		);
	}

	return (
		<div className="space-y-6">
			{releases.map((release) => (
				<div
					key={release.id}
					className="bg-white border border-gray-200 rounded-lg p-6"
				>
					<div className="flex items-start justify-between mb-4">
						<div>
							<h3 className="text-xl font-semibold text-gray-900 mb-1">
								{release.name || release.tagName}
							</h3>
							<p className="text-sm text-gray-500">
								منتشر شده در {formatDate(release.publishedAt)}
							</p>
						</div>
						<div className="flex gap-2">
							{release.prerelease && (
								<span className="px-2 py-1 text-xs font-medium bg-yellow-100 text-yellow-800 rounded">
									Pre-release
								</span>
							)}
							{release.draft && (
								<span className="px-2 py-1 text-xs font-medium bg-gray-100 text-gray-800 rounded">
									Draft
								</span>
							)}
						</div>
					</div>

					{release.body && (
						<div className="mb-4">
							<p className="text-gray-700 whitespace-pre-wrap">
								{String(release.body)}
							</p>
						</div>
					)}

					{release.assets && (
						<div>
							<h4 className="text-sm font-medium text-gray-900 mb-3">
								فایل‌های دانلود:
							</h4>
							<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
								{["macos", "windows", "linux"].map((platform) => {
									const asset = getAssetForPlatform(release.assets, platform);
									if (!asset) return null;

									return (
										<a
											key={platform}
											href={asset.browser_download_url}
											className="flex items-center p-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
										>
											<div className="flex-1">
												<div className="font-medium text-gray-900">
													{getPlatformName(platform)}
												</div>
												<div className="text-sm text-gray-500">
													{(asset.size / 1024 / 1024).toFixed(1)} MB
												</div>
											</div>
											<svg
												className="w-5 h-5 text-gray-400"
												fill="none"
												stroke="currentColor"
												viewBox="0 0 24 24"
												aria-hidden="true"
											>
												<path
													strokeLinecap="round"
													strokeLinejoin="round"
													strokeWidth={2}
													d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
												/>
											</svg>
										</a>
									);
								})}
							</div>
						</div>
					)}
				</div>
			))}
		</div>
	);
}
