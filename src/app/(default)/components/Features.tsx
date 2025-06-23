import PlanetImg from "@/public/images/features-image.svg";
import {
	DraftingCompass,
	FilePenLine,
	Funnel,
	Grid2x2,
	Monitor,
	Pencil,
} from "lucide-react";
import Image from "next/image";

export default function Features() {
	return (
		<section className="relative before:absolute before:inset-0 before:-z-20 before:bg-gray-900">
			<div className="mx-auto max-w-6xl px-4 sm:px-6">
				<div className="py-12 md:py-20">
					<div className="mx-auto max-w-3xl pb-16 text-center md:pb-20">
						<h2 className="text-3xl font-bold text-gray-200 md:text-4xl">
							Intuitive and well-designed GUI simplifies your database
							administration and development.
						</h2>
					</div>
					<div className="pb-16 md:pb-20" data-aos="zoom-y-out">
						<div className="text-center">
							<div className="relative inline-flex">
								<Image
									className="rounded-full bg-gray-900"
									src={PlanetImg}
									width={400}
									height={400}
									alt="Planet"
								/>
							</div>
						</div>
					</div>
					<div className="grid overflow-hidden sm:grid-cols-2 lg:grid-cols-3 *:relative *:p-6 *:before:absolute *:before:bg-gray-800 *:before:[block-size:100vh] *:before:[inline-size:1px] *:before:[inset-block-start:0] *:before:[inset-inline-start:-1px] *:after:absolute *:after:bg-gray-800 *:after:[block-size:1px] *:after:[inline-size:100vw] *:after:[inset-block-start:-1px] *:after:[inset-inline-start:0] md:*:p-10">
						<article>
							<h3 className="mb-2 flex items-center space-x-2 font-medium text-gray-200">
								<Pencil size={16} color="#2b7fff" />
								<span>Inline edit</span>
							</h3>
							<p className="text-[15px] text-gray-400">
								Edit data rows, table structure, or query results directly with
								just a click.
							</p>
						</article>
						<article>
							<h3 className="mb-2 flex items-center space-x-2 font-medium text-gray-200">
								<Funnel size={20} color="#2b7fff" />
								<span>Advanced filters</span>
							</h3>
							<p className="text-[15px] text-gray-400">
								Quickly see the records you need using multiple advanced
								filters.
							</p>
						</article>
						<article>
							<h3 className="mb-2 flex items-center space-x-2 font-medium text-gray-200">
								<Grid2x2 size={20} color="#2b7fff" />
								<span>Multiple tabs & windows</span>
							</h3>
							<p className="text-[15px] text-gray-400">
								Working with multiple databases or connections at the same.
							</p>
						</article>
						<article>
							<h3 className="mb-2 flex items-center space-x-2 font-medium text-gray-200">
								<DraftingCompass size={20} color="#2b7fff" />
								<span>Object Designer</span>
							</h3>
							<p className="text-[15px] text-gray-400">
								Manage all the database objects with smart object designer.
							</p>
						</article>
						<article>
							<h3 className="mb-2 flex items-center space-x-2 font-medium text-gray-200">
								<FilePenLine size={20} color="#2b7fff" />
								<span>Code Completion</span>
							</h3>
							<p className="text-[15px] text-gray-400">
								Construct queries in the Query Editor by picking the suggestions
								from the drop-down list.
							</p>
						</article>
						<article>
							<h3 className="mb-2 flex items-center space-x-2 font-medium text-gray-200">
								<Monitor size={20} color="#2b7fff" />
								<span>Web GUI</span>
							</h3>
							<p className="text-[15px] text-gray-400">
								Run easily your queries in the browser with the web GUI.
							</p>
						</article>
					</div>
				</div>
			</div>
		</section>
	);
}
