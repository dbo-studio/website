export default function Loading() {
	return (
		<div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto animate-pulse">
			{[1, 2, 3, 4].map((i) => (
				<div key={`loader-item-${i}`} className="h-36 bg-gray-200 rounded-lg" />
			))}
		</div>
	);
}
