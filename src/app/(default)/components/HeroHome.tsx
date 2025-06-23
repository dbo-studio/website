import PageIllustration from "@/src/app/(default)/components/PageIllustration";
import Carousel from "./Carousel";
import DownloadButton from "./DownloadButton/DownloadButton";

export default function HeroHome() {
	return (
		<section className="relative">
			<PageIllustration />
			<div className="mx-auto max-w-6xl px-4 sm:px-6">
				{/* Hero content */}
				<div className="pb-12 pt-32 md:pb-20 md:pt-40">
					{/* Section header */}
					<div className="pb-12 text-center md:pb-16">
						<h1
							className="mb-6 border-y text-5xl font-bold [border-image:linear-gradient(to_right,transparent,--theme(--color-slate-300/.8),transparent)1] md:text-6xl"
							data-aos="zoom-y-out"
							data-aos-delay={150}
						>
							Modern and easy to use <br className="max-lg:hidden" />
							Database GUI
						</h1>
						<div className="mx-auto max-w-3xl">
							<p
								className="mb-8 text-lg text-gray-700"
								data-aos="zoom-y-out"
								data-aos-delay={300}
							>
								DBO Studio is a minimal and open source database GUI
							</p>
							<div className="relative before:absolute before:inset-0 before:border-y before:[border-image:linear-gradient(to_right,transparent,--theme(--color-slate-300/.8),transparent)1]">
								<div
									className="mx-auto max-w-xs sm:flex sm:max-w-none sm:justify-center"
									data-aos="zoom-y-out"
									data-aos-delay={450}
								>
									<DownloadButton />
									<a
										className="btn w-full bg-white text-gray-800 shadow-sm hover:bg-gray-50 sm:ml-4 sm:w-auto mt-3 md:mt-0"
										href="#features"
									>
										Learn More
									</a>
								</div>
							</div>
						</div>
					</div>
					{/* Hero image */}
					<div
						className="mx-auto max-w-3xl"
						data-aos="zoom-y-out"
						data-aos-delay={600}
					>
						<Carousel />
					</div>
				</div>
			</div>
		</section>
	);
}
