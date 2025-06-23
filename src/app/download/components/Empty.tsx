export default function Empty() {
	return (
		<div className="text-center text-gray-600 bg-gray-50 p-4 rounded-lg">
			No download links available for the latest version.
			<a href="/releases" className="text-indigo-600 hover:underline ml-2">
				View all releases
			</a>
		</div>
	);
}
