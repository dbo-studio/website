"use client";

import { useCallback, useEffect, useState } from "react";

import { logger } from "@/src/lib/logger";
import type { Asset } from "@/src/lib/schema";
import { SiApple, SiLinux } from "@icons-pack/react-simple-icons";
import { getLatestVersion } from "../../../lib/actions";
import type { Platform } from "../types";
import WindowsIcon from "./../../../components/WindowsIcon";
import DownloadItem from "./DownloadItem";
import Empty from "./Empty";
import Loading from "./Loading";

export default function DownloadBox() {
	const [platforms, setPlatforms] = useState<Platform[]>([]);
	const [loading, setLoading] = useState(true);

	const fetchLatestRelease = useCallback(async () => {
		try {
			setLoading(true);
			const result = await getLatestVersion();
			if (!result) return;

			getAssets(result.assets || []);
		} catch (err) {
			console.log("🚀 ~ fetchLatestRelease ~ err:", err);
			logger.error("Error fetching releases:", err);
		} finally {
			setLoading(false);
		}
	}, []);

	useEffect(() => {
		fetchLatestRelease();
	}, [fetchLatestRelease]);

	const getAssets = useCallback((assets: Asset[]): void => {
		if (!assets || !Array.isArray(assets)) return;

		const platformConfigs = [
			{
				key: "macos-arm" as const,
				name: "macOS M Chip (ARM)",
				arch: "arm64",
				icon: <SiApple className="text-gray-500" />,
				finder: (asset: Asset) =>
					asset.name.toLowerCase().includes("aarch64.dmg"),
			},
			{
				key: "macos-intel" as const,
				name: "macOS Intel",
				arch: "x64",
				icon: <SiApple className="text-gray-500" />,
				finder: (asset: Asset) => asset.name.toLowerCase().includes("x64.dmg"),
			},
			{
				key: "windows" as const,
				name: "Windows",
				arch: "x64",
				icon: (
					<WindowsIcon
						className="filter"
						style={{
							filter:
								"brightness(0) saturate(100%) invert(42%) sepia(8%) saturate(1234%) hue-rotate(202deg) brightness(95%) contrast(86%)",
						}}
					/>
				),
				finder: (asset: Asset) =>
					asset.name.toLowerCase().endsWith("x64-setup.exe"),
			},
			{
				key: "linux" as const,
				name: "Linux",
				arch: "amd64",
				icon: <SiLinux className="text-gray-500" />,
				finder: (asset: Asset) =>
					asset.name.toLowerCase().endsWith("amd64.deb"),
			},
			{
				key: "appimage" as const,
				name: "Linux AppImage",
				arch: "amd64",
				icon: <SiLinux className="text-gray-500" />,
				finder: (asset: Asset) =>
					asset.name.toLowerCase().endsWith("amd64.appimage"),
			},
		];

		// @ts-expect-error
		const platforms: Platform[] = platformConfigs
			.map((config) => {
				const asset = assets.find(config.finder);
				return asset ? { ...config, asset } : null;
			})
			// @ts-expect-error
			.filter((platform): platform is Platform => platform !== null);

		setPlatforms(platforms);
	}, []);

	if (loading) {
		return <Loading />;
	}

	if (platforms.length === 0) {
		return <Empty />;
	}

	return (
		<div className="max-w-4xl mx-auto">
			<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
				{platforms.map((p) => (
					<DownloadItem key={p.key} platform={p} />
				))}
			</div>
			<div className="text-center mt-12">
				<p className="text-sm text-gray-500 mb-2">
					Looking for older versions or pre-releases?
				</p>
				<a
					href="/releases"
					className="font-medium text-indigo-600 hover:text-indigo-500"
				>
					View all releases
				</a>
			</div>
		</div>
	);
}
