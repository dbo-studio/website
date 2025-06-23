"use client";

import { getReleasesFromDB } from "@/src/lib/actions";
import type { DatabaseRelease } from "@/src/lib/types";
import { useCallback, useEffect, useState } from "react";
import Markdown from "react-markdown";

import remarkGfm from "remark-gfm";
import ArchInfo from "./ArchInfo";
import Empty from "./Empty";
import Loading from "./Loading";
import PlatformIcon from "./PlatformIcon";

type Asset = {
	name: string;
	browser_download_url: string;
	size: number;
};

export default function Releases() {
	const [releases, setReleases] = useState<DatabaseRelease[]>([]);
	const [loading, setLoading] = useState(true);

	const fetchReleases = useCallback(async () => {
		try {
			setLoading(true);
			const result = await getReleasesFromDB();
			if (result.success && result.releases) {
				setReleases(result.releases);
			}
			setLoading(false);
		} catch (err) {
			console.error("Error fetching releases:", err);
			setLoading(false);
		}
	}, []);

	useEffect(() => {
		fetchReleases();
	}, [fetchReleases]);

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
		return <Loading />;
	}

	if (releases.length === 0) {
		return <Empty />;
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
								<Markdown remarkPlugins={[remarkGfm]}>
									{String(release.body)}
								</Markdown>
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
