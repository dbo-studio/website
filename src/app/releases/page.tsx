import DownloadPage from "./components/DownloadPage";

export const metadata = {
	title: "Releases - DBO Studio",
	description: "Browse all releases of DBO Studio",
};

export default function Releases() {
	return (
		<section className="relative">
			<div className="mx-auto max-w-6xl px-4 sm:px-6">
				<div className="pb-12 pt-32 md:pb-20 md:pt-40">
					<div className="mx-auto max-w-3xl pb-12 text-center md:pb-16">
						<h1 className="mb-4 text-5xl font-extrabold tracking-tighter md:text-6xl">
							Releases
						</h1>
						<p className="text-lg text-gray-600">
							Browse all releases of DBO Studio, including pre-releases and
							older versions.
						</p>
					</div>
					<DownloadPage />
				</div>
			</div>
		</section>
	);
}
