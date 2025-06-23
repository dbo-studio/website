import { Download } from "lucide-react";
import type { Platform } from "../types";

export default function DownloadItem({
	platform,
}: {
	platform: Platform;
}) {
	return (
		<a
			href={platform.asset?.browser_download_url}
			className={
				"group block text-left p-6 border rounded-lg transition-all duration-300"
			}
		>
			<div className="flex items-center justify-between">
				<div className="flex items-center gap-4">
					<div className="text-white">{platform.icon}</div>
					<div>
						<h3 className="text-xl font-bold text-gray-900">{platform.name}</h3>
						<p className="text-sm text-gray-500">{platform.arch}</p>
					</div>
				</div>
				<div>
					<Download className="w-6 h-6 text-gray-500" />
				</div>
			</div>
		</a>
	);
}
