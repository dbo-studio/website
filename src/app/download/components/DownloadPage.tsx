"use client";

import type { Platform, Release } from "@/src/lib/types";
import {
	PLATFORMS,
	detectPlatform,
	formatFileSize,
	getAssetForPlatform,
	getPlatformIcon,
	getPlatformName,
} from "@/src/lib/utils";
import { useEffect, useState } from "react";
import DatabaseReleases from "./DatabaseReleases";

export default function DownloadPage() {
	const [releases, setReleases] = useState<Release[]>([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);
	const [userPlatform, setUserPlatform] = useState<Platform | null>(null);
	const [useDatabase, setUseDatabase] = useState(true);

	useEffect(() => {
		const platform = detectPlatform();
		setUserPlatform(platform);

		const fetchReleases = async () => {
			try {
				const response = await fetch(
					"https://api.github.com/repos/dbo-studio/dbo/releases",
				);
				if (!response.ok) {
					throw new Error("Failed to fetch releases");
				}
				const data = await response.json();
				setReleases(data);
			} catch (err) {
				setError(err instanceof Error ? err.message : "خطا در دریافت اطلاعات");
			} finally {
				setLoading(false);
			}
		};

		fetchReleases();
	}, []);

	if (loading) {
		return (
			<section className="relative">
				<div className="mx-auto max-w-6xl px-4 sm:px-6">
					<div className="pb-12 pt-32 md:pb-20 md:pt-40">
						<div className="text-center">
							<div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto" />
							<p className="mt-4 text-gray-600">
								در حال دریافت اطلاعات دانلود...
							</p>
						</div>
					</div>
				</div>
			</section>
		);
	}

	if (error) {
		return (
			<section className="relative">
				<div className="mx-auto max-w-6xl px-4 sm:px-6">
					<div className="pb-12 pt-32 md:pb-20 md:pt-40">
						<div className="text-center">
							<p className="text-red-600">خطا: {error}</p>
						</div>
					</div>
				</div>
			</section>
		);
	}

	const latestRelease = releases[0];

	return (
		<section className="relative">
			<div className="mx-auto max-w-6xl px-4 sm:px-6">
				<div className="pb-12 pt-32 md:pb-20 md:pt-40">
					{/* Header */}
					<div className="pb-12 text-center md:pb-16">
						<h1 className="mb-6 text-5xl font-bold md:text-6xl">
							دانلود DBO Studio
						</h1>
						<p className="mx-auto max-w-3xl text-lg text-gray-700">
							آخرین نسخه: {latestRelease?.tagName} - {latestRelease?.name}
						</p>

						{/* Toggle between Database and GitHub */}
						<div className="mt-6 flex justify-center">
							<div className="bg-gray-100 rounded-lg p-1">
								<button
									type="button"
									onClick={() => setUseDatabase(true)}
									className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
										useDatabase
											? "bg-white text-gray-900 shadow-sm"
											: "text-gray-600 hover:text-gray-900"
									}`}
								>
									از دیتابیس
								</button>
								<button
									type="button"
									onClick={() => setUseDatabase(false)}
									className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
										!useDatabase
											? "bg-white text-gray-900 shadow-sm"
											: "text-gray-600 hover:text-gray-900"
									}`}
								>
									از GitHub
								</button>
							</div>
						</div>
					</div>

					{/* Content based on selected source */}
					{useDatabase ? (
						<DatabaseReleases />
					) : (
						<>
							{/* Recommended Download */}
							{userPlatform && latestRelease && (
								<div className="mb-12">
									<h2 className="text-2xl font-bold text-center mb-8">
										پیشنهاد شده برای شما
									</h2>
									<div className="max-w-md mx-auto">
										{(() => {
											const recommendedAsset = getAssetForPlatform(
												latestRelease.assets,
												userPlatform,
											);
											if (recommendedAsset) {
												return (
													<div className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-lg p-6 text-center">
														<div className="text-4xl mb-4">
															{getPlatformIcon(userPlatform)}
														</div>
														<h3 className="text-xl font-semibold mb-2">
															{getPlatformName(userPlatform)}
														</h3>
														<p className="text-gray-600 mb-4">
															{formatFileSize(recommendedAsset.size)}
														</p>
														<a
															href={recommendedAsset.browser_download_url}
															className="btn w-full bg-linear-to-t from-blue-600 to-blue-500 bg-[length:100%_100%] bg-[bottom] text-white shadow-sm hover:bg-[length:100%_150%]"
														>
															دانلود برای {getPlatformName(userPlatform)}
														</a>
													</div>
												);
											}
											return null;
										})()}
									</div>
								</div>
							)}

							{/* All Platforms */}
							<div className="mb-12">
								<h2 className="text-2xl font-bold text-center mb-8">
									همه پلتفرم‌ها
								</h2>
								<div className="grid md:grid-cols-3 gap-6">
									{PLATFORMS.map((platform) => {
										const asset = latestRelease
											? getAssetForPlatform(latestRelease.assets, platform.id)
											: null;
										return (
											<div
												key={platform.id}
												className="bg-white border border-gray-200 rounded-lg p-6 text-center hover:shadow-lg transition-shadow"
											>
												<div className="text-4xl mb-4">{platform.icon}</div>
												<h3 className="text-xl font-semibold mb-2">
													{platform.name}
												</h3>
												{asset ? (
													<>
														<p className="text-gray-600 mb-4">
															{formatFileSize(asset.size)}
														</p>
														<a
															href={asset.browser_download_url}
															className="btn w-full bg-gray-800 text-white hover:bg-gray-700"
														>
															دانلود
														</a>
													</>
												) : (
													<p className="text-gray-500">در دسترس نیست</p>
												)}
											</div>
										);
									})}
								</div>
							</div>

							{/* Previous Releases */}
							{releases.length > 1 && (
								<div>
									<h2 className="text-2xl font-bold text-center mb-8">
										نسخه‌های قبلی
									</h2>
									<div className="space-y-4">
										{releases.slice(1, 6).map((release) => (
											<div
												key={release.tagName}
												className="bg-white border border-gray-200 rounded-lg p-4"
											>
												<div className="flex justify-between items-center">
													<div>
														<h3 className="font-semibold">
															{release.name || release.tagName}
														</h3>
														<p className="text-sm text-gray-600">
															منتشر شده در{" "}
															{release.publishedAt
																? release.publishedAt.toLocaleDateString(
																		"fa-IR",
																	)
																: "Unknown date"}
														</p>
													</div>
													<a
														href={`https://github.com/dbo-studio/dbo/releases/tag/${release.tagName}`}
														className="btn bg-gray-100 text-gray-800 hover:bg-gray-200"
														target="_blank"
														rel="noopener noreferrer"
													>
														مشاهده
													</a>
												</div>
											</div>
										))}
									</div>
								</div>
							)}
						</>
					)}
				</div>
			</div>
		</section>
	);
}
