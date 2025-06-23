"use client";

import { useEffect, useState } from "react";

import WindowsIcon from "@/src/components/WindowsIcon";
import { getLatestVersion } from "@/src/lib/actions";
import { logger } from "@/src/lib/logger";
import type { Asset } from "@/src/lib/schema";
import { SiApple, SiLinux } from "@icons-pack/react-simple-icons";
import { Download } from "lucide-react";
import type { ReactElement } from "react";

type Platform = {
	key: PlatformKey;
	name: string;
	arch: string;
	icon: ReactElement;
	asset?: Asset;
};

type PlatformKey =
	| "macos-arm"
	| "macos-intel"
	| "windows"
	| "linux"
	| "appimage";

export default function SimpleDownload() {
	const [platforms, setPlatforms] = useState<Platform[]>([]);
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		async function fetchLatestRelease() {
			try {
				setLoading(true);
				const result = await getLatestVersion();
				if (!result) return;

				getAssets(result.assets);
			} catch (err) {
				console.log("🚀 ~ fetchLatestRelease ~ err:", err);
				logger.error("Error fetching releases:", err);
			} finally {
				setLoading(false);
			}
		}

		fetchLatestRelease();
	}, []);

	const getAssets = (assets: unknown): void => {
		if (!assets || !Array.isArray(assets)) return;

		const assetList = assets;
		const platforms: Platform[] = [];

		const macIntel = assetList.find((a) =>
			a.name.toLowerCase().includes("x64.dmg"),
		);
		const macArm = assetList.find((a) =>
			a.name.toLowerCase().includes("aarch64.dmg"),
		);

		const windows = assetList.find((a) =>
			a.name.toLowerCase().endsWith("x64-setup.exe"),
		);

		const linuxDeb = assetList.find((a) =>
			a.name.toLowerCase().endsWith("amd64.deb"),
		);

		const linuxAppImage = assetList.find((a) =>
			a.name.toLowerCase().endsWith("amd64.appimage"),
		);

		if (macArm) {
			platforms.push({
				asset: macArm,
				key: "macos-arm",
				name: "macOS M Chip (ARM)",
				arch: "arm64",
				icon: <SiApple className="text-gray-500" />,
			});
		}

		if (macIntel) {
			platforms.push({
				asset: macIntel,
				key: "macos-intel",
				name: "macOS Intel",
				arch: "x64",
				icon: <SiApple className="text-gray-500" />,
			});
		}

		if (windows) {
			platforms.push({
				asset: windows,
				key: "windows",
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
			});
		}

		if (linuxDeb) {
			platforms.push({
				asset: linuxDeb,
				key: "linux",
				name: "Linux",
				arch: "amd64",
				icon: <SiLinux className="text-gray-500" />,
			});
		}

		if (linuxAppImage) {
			platforms.push({
				asset: linuxAppImage,
				key: "appimage",
				name: "Linux AppImage",
				arch: "amd64",
				icon: <SiLinux className="text-gray-500" />,
			});
		}

		setPlatforms(platforms);
	};

	if (loading) {
		return (
			<div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto animate-pulse">
				{[1, 2, 3, 4].map((i) => (
					<div
						key={`loader-item-${i}`}
						className="h-36 bg-gray-200 rounded-lg"
					/>
				))}
			</div>
		);
	}

	if (platforms.length === 0) {
		return (
			<div className="text-center text-gray-600 bg-gray-50 p-4 rounded-lg">
				No download links available for the latest version.
				<a href="/releases" className="text-indigo-600 hover:underline ml-2">
					View all releases
				</a>
			</div>
		);
	}

	return (
		<div className="max-w-4xl mx-auto">
			<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
				{platforms.map((p) => (
					<a
						key={p.key}
						href={p.asset?.browser_download_url}
						className={
							"group block text-left p-6 border rounded-lg transition-all duration-300"
						}
					>
						<div className="flex items-center justify-between">
							<div className="flex items-center gap-4">
								<div className="text-white">{p.icon}</div>
								<div>
									<h3 className="text-xl font-bold text-gray-900">{p.name}</h3>
									<p className="text-sm text-gray-500">{p.arch}</p>
								</div>
							</div>
							<div>
								<Download className="w-6 h-6 text-gray-500" />
							</div>
						</div>
					</a>
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
