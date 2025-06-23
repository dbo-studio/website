"use client";

import { getReleasesFromDB } from "@/src/lib/actions";
import type { DatabaseRelease } from "@/src/lib/types";
import { useEffect, useState } from "react";
import ReactMarkdown from "react-markdown";

import WindowsIcon from "@/src/components/WindowsIcon";
import {
	SiApple,
	SiArm,
	SiIntel,
	SiLinux,
} from "@icons-pack/react-simple-icons";
import { Cpu, HardDriveDownload } from "lucide-react";

type Asset = {
	name: string;
	browser_download_url: string;
	size: number;
};

const PlatformIcon = ({ name }: { name: string }) => {
	const lowerCaseName = name.toLowerCase();
	if (lowerCaseName.includes("windows") || lowerCaseName.includes(".exe")) {
		return <WindowsIcon />;
	}
	if (
		lowerCaseName.includes("macos") ||
		lowerCaseName.includes("darwin") ||
		lowerCaseName.includes(".dmg")
	) {
		return <SiApple className="w-5 h-5 text-gray-500" />;
	}
	if (lowerCaseName.includes("linux") || lowerCaseName.includes(".deb")) {
		return <SiLinux className="w-5 h-5 text-yellow-500" />;
	}
	return <HardDriveDownload className="w-5 h-5 text-gray-400" />;
};

const ArchInfo = ({ name }: { name: string }) => {
	const lowerCaseName = name.toLowerCase();
	if (lowerCaseName.includes("arm64") || lowerCaseName.includes("aarch64")) {
		return (
			<div className="flex items-center gap-1.5">
				<SiArm className="w-4 h-4 text-gray-500" />
				<span className="text-xs text-gray-600">ARM64</span>
			</div>
		);
	}
	if (lowerCaseName.includes("intel") || lowerCaseName.includes("x64")) {
		return (
			<div className="flex items-center gap-1.5">
				<SiIntel className="w-4 h-4 text-gray-500" />
				<span className="text-xs text-gray-600">Intel x64</span>
			</div>
		);
	}
	return (
		<div className="flex items-center gap-1.5">
			<Cpu className="w-4 h-4 text-gray-400" />
			<span className="text-xs text-gray-600">Universal</span>
		</div>
	);
};

export default function DownloadPage() {
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
				setError("An unexpected error occurred.");
			} finally {
				setLoading(false);
			}
		}

		fetchReleases();
	}, []);

	const formatDate = (date: Date | null) => {
		if (!date) return "Unknown date";
		return new Date(date).toLocaleDateString("en-US", {
			year: "numeric",
			month: "long",
			day: "numeric",
		});
	};

	const formatSize = (bytes: number) => {
		if (bytes === 0) return "0 B";
		const k = 1024;
		const sizes = ["B", "KB", "MB", "GB", "TB"];
		const i = Math.floor(Math.log(bytes) / Math.log(k));
		return `${Number.parseFloat((bytes / k ** i).toFixed(1))} ${sizes[i]}`;
	};

	if (loading) {
		return (
			<div className="animate-pulse space-y-8">
				{[1, 2, 3].map((n) => (
					<div
						key={`loader-skeleton-${n}`}
						className="p-6 bg-white rounded-lg shadow-md border border-gray-200"
					>
						<div className="h-7 bg-gray-200 rounded w-1/3 mb-2" />
						<div className="h-4 bg-gray-200 rounded w-1/4 mb-6" />
						<div className="space-y-3">
							<div className="h-4 bg-gray-200 rounded w-full" />
							<div className="h-4 bg-gray-200 rounded w-5/6" />
						</div>
					</div>
				))}
			</div>
		);
	}

	if (error) {
		return (
			<div className="bg-red-50 text-red-700 border border-red-200 rounded-lg p-6 text-center">
				<h3 className="font-bold text-lg mb-2">Error</h3>
				<p>{error}</p>
			</div>
		);
	}

	if (releases.length === 0) {
		return (
			<div className="bg-gray-50 border border-gray-200 rounded-lg p-10 text-center">
				<p className="text-gray-600">No releases found.</p>
			</div>
		);
	}

	return (
		<div className="space-y-12">
			{releases.map((release) => (
				<div
					key={release.id}
					className="bg-white border border-gray-200/80 rounded-xl shadow-sm overflow-hidden"
				>
					<div className="p-6 md:p-8">
						<div className="flex items-start justify-between mb-4 flex-wrap gap-2">
							<div>
								<h2 className="text-2xl font-bold text-gray-900">
									{release.name || release.tagName}
								</h2>
								<p className="text-sm text-gray-500 mt-1">
									Published on {formatDate(release.publishedAt)}
								</p>
							</div>
							{release.prerelease && (
								<span className="px-3 py-1 text-xs font-medium bg-yellow-100 text-yellow-800 rounded-full">
									Pre-release
								</span>
							)}
						</div>

						{release.body && (
							<div className="prose prose-sm max-w-none text-gray-700 mb-8">
								<ReactMarkdown>{String(release.body)}</ReactMarkdown>
							</div>
						)}

						<div>
							<h3 className="text-lg font-semibold text-gray-800 mb-4">
								Downloads
							</h3>
							<div className="overflow-x-auto">
								<table className="min-w-full divide-y divide-gray-200">
									<thead className="bg-gray-50">
										<tr>
											<th
												scope="col"
												className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
											>
												Asset
											</th>
											<th
												scope="col"
												className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
											>
												Platform
											</th>
											<th
												scope="col"
												className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
											>
												Architecture
											</th>
											<th
												scope="col"
												className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
											>
												Size
											</th>
											<th scope="col" className="relative px-6 py-3">
												<span className="sr-only">Download</span>
											</th>
										</tr>
									</thead>
									<tbody className="bg-white divide-y divide-gray-200">
										{(release.assets as Asset[])?.map((asset) => (
											<tr key={asset.name}>
												<td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
													{asset.name}
												</td>
												<td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
													<PlatformIcon name={asset.name} />
												</td>
												<td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
													<ArchInfo name={asset.name} />
												</td>
												<td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
													{formatSize(asset.size)}
												</td>
												<td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
													<a
														href={asset.browser_download_url}
														className="text-indigo-600 hover:text-indigo-900"
													>
														Download
													</a>
												</td>
											</tr>
										))}
									</tbody>
								</table>
							</div>
						</div>
					</div>
				</div>
			))}
		</div>
	);
}
