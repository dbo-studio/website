"use client";

import { getDownloadAsset, getLatestVersion } from "@/src/lib/actions";
import { useCallback, useEffect, useState } from "react";
import PlatformIcon from "./PlatformIcon";

export default function DownloadButton() {
	const [downloadUrl, setDownloadUrl] = useState<string>("");
	const [loading, setLoading] = useState(true);
	const [platform, setPlatform] = useState<string>("");

	const detectPlatform = useCallback(() => {
		const userAgent = navigator.userAgent.toLowerCase();
		if (userAgent.includes("mac")) return "macos";
		if (userAgent.includes("win")) return "windows";
		if (userAgent.includes("linux")) return "linux";
		return "unknown";
	}, []);

	const fetchDownloadLink = useCallback(async (platform: string) => {
		try {
			setLoading(true);

			const latestVersion = await getLatestVersion();
			if (!latestVersion) {
				setDownloadUrl("/download");
				return;
			}

			const assets = await getDownloadAsset(latestVersion, platform);
			console.log("🚀 ~ fetchDownloadLink ~ assets:", assets);

			if (assets.success) {
				setDownloadUrl(assets.asset.browser_download_url);
			} else {
				setDownloadUrl("/download");
			}
		} catch (err) {
			console.error("Error fetching download link:", err);
			setDownloadUrl("/downloads");
		} finally {
			setLoading(false);
		}
	}, []);

	// biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
	useEffect(() => {
		const detectedPlatform = detectPlatform();
		setPlatform(detectedPlatform);
		fetchDownloadLink(detectedPlatform);
	}, []);

	const handleDownload = () => {
		if (downloadUrl) {
			window.open(downloadUrl, "_blank");
		}
	};

	const getButtonText = () => {
		if (loading) return "Loading...";

		if (
			platform === "unknown" ||
			(platform !== "macos" && platform !== "windows" && platform !== "linux")
		)
			return "Download";

		return "Download for";
	};

	const isDisabled = loading || !downloadUrl;

	return (
		<div>
			<button
				type="button"
				onClick={handleDownload}
				disabled={isDisabled}
				className={`
				inline-flex w-full items-center justify-center px-6 py-3 text-base font-medium rounded-lg
				transition-colors duration-200 cursor-pointer
				${
					isDisabled
						? "bg-gray-300 text-gray-500 cursor-not-allowed"
						: "bg-sky-800 text-white hover:bg-sky-900 focus:ring-4 focus:ring-sky-300"
				}
			`}
			>
				<p className="mr-2 text-center">{getButtonText()}</p>
				{!loading && platform !== "unknown" && (
					<PlatformIcon platform={platform} />
				)}
			</button>
		</div>
	);
}
