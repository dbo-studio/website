"use client";

import type { Release } from "../../../../lib/types";

export default function LatestVersion({ release }: { release: Release }) {
	return (
		<div className="flex items-center gap-2">
			<span className="text-sm text-gray-500">Latest version:</span>
			<span className="text-sm font-medium text-gray-900">
				{release.tagName}
			</span>
		</div>
	);
}
