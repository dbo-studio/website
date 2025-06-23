"use client";

import { useEffect, useState } from "react";
import { getDownloadAsset, getLatestVersion } from "../../../../lib/actions";
import PlatformIcon from "./PlatformIcon";

export default function DownloadButton() {
	const [platform, setPlatform] = useState<string>("");
	const [downloadUrl, setDownloadUrl] = useState<string>("");
	const [loading, setLoading] = useState(true);

	// biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
	useEffect(() => {
		const detectPlatform = () => {
			const userAgent = navigator.userAgent.toLowerCase();
			if (userAgent.includes("mac")) return "macos";
			if (userAgent.includes("win")) return "windows";
			if (userAgent.includes("linux")) return "linux";
			return "unknown";
		};

		const detectedPlatform = detectPlatform();
		setPlatform(detectedPlatform);

		async function fetchDownloadLink() {
			try {
				setLoading(true);

				const latestVersion = await getLatestVersion();
				if (!latestVersion) {
					setDownloadUrl("/downloads");
					return;
				}

				const assets = await getDownloadAsset(latestVersion, platform);

				if (assets.success) {
					setDownloadUrl(assets.asset.browser_download_url);
				} else {
					setDownloadUrl("/downloads");
				}
			} catch (err) {
				console.error("Error fetching download link:", err);
				setDownloadUrl("/downloads");
			} finally {
				setLoading(false);
			}
		}

		fetchDownloadLink();
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
				inline-flex items-center px-6 py-3 text-base font-medium rounded-lg
				transition-colors duration-200 cursor-pointer
				${
					isDisabled
						? "bg-gray-300 text-gray-500 cursor-not-allowed"
						: "bg-blue-600 text-white hover:bg-blue-700 focus:ring-4 focus:ring-blue-300"
				}
			`}
			>
				<span className="mr-2">{getButtonText()}</span>
				{!loading && platform !== "unknown" && (
					<PlatformIcon platform={platform} />
				)}
			</button>
		</div>
	);
}
