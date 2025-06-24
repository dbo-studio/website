import { APP_CONFIG } from "@/src/lib/constants";
import { SiGithub } from "@icons-pack/react-simple-icons";
import Link from "next/link";
import Logo from "./logo";

export default function Footer() {
	return (
		<footer>
			<div className="mx-auto max-w-6xl px-4 sm:px-6">
				<div className={"flex justify-between py-8"}>
					<div className="space-y-2 sm:col-span-12 lg:col-span-4">
						<div className="text-sm text-gray-600 flex items-center gap-2">
							<Logo /> &copy; DBO Studio - All rights reserved.
						</div>
					</div>

					<div className="space-y-2 sm:col-span-6 md:col-span-3 lg:col-span-2">
						<ul className="flex gap-1">
							<li>
								<Link
									target="_blank"
									className="flex items-center justify-center text-blue-500 transition hover:text-blue-600"
									href={APP_CONFIG.github.repoUrl}
									aria-label="Github"
								>
									<SiGithub className="text-gray-500" />
								</Link>
							</li>
						</ul>
					</div>
				</div>
			</div>
		</footer>
	);
}
