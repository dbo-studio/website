import DownloadBox from "./components/DownloadBox";

export const metadata = {
	title: "Download - DBO Studio",
	description: "Download the latest version of DBO Studio",
};

export default function Download() {
	return (
		<section className="relative">
			<div className="mx-auto max-w-6xl px-4 sm:px-6">
				<div className="pb-12 pt-32 md:pb-20 md:pt-40">
					<div className="mx-auto max-w-3xl pb-12 text-center md:pb-16">
						<h1 className="mb-4 text-5xl font-extrabold tracking-tighter md:text-6xl">
							Download DBO Studio
						</h1>
						<p className="text-lg text-gray-600">
							Get the latest version for your operating system.
						</p>
					</div>
					<DownloadBox />
				</div>
			</div>
		</section>
	);
}
