export default function Loading() {
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
