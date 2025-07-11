import { APP_CONFIG } from "@/src/lib/constants";
import Link from "next/link";
import Logo from "./logo";

export default function Header() {
	return (
		<header className="fixed top-2 z-30 w-full md:top-6">
			<div className="mx-auto max-w-6xl px-4 sm:px-6">
				<div className="relative flex h-14 items-center justify-between gap-3 rounded-2xl bg-white/90 px-3 shadow-lg shadow-black/[0.03] backdrop-blur-xs before:pointer-events-none before:absolute before:inset-0 before:rounded-[inherit] before:border before:border-transparent before:[background:linear-gradient(var(--color-gray-100),var(--color-gray-200))_border-box] before:[mask-composite:exclude_!important] before:[mask:linear-gradient(white_0_0)_padding-box,_linear-gradient(white_0_0)]">
					<div className="flex flex-1 items-center">
						<Logo />
					</div>

					<ul className="flex flex-1 items-center justify-end gap-3">
						<li>
							<Link
								href="/download"
								className="btn-sm bg-white text-gray-800 shadow-sm hover:bg-gray-50"
							>
								Download
							</Link>
						</li>
						<li>
							<Link
								href="/releases"
								className="btn-sm bg-gray-800 text-gray-200 shadow-sm hover:bg-gray-900"
							>
								Releases
							</Link>
						</li>

						<li>
							<Link
								target="_blank"
								className="flex items-center justify-center text-blue-500 transition hover:text-blue-600"
								href={APP_CONFIG.github.repoUrl}
								aria-label="Github"
							>
								<img
									src={`https://img.shields.io/github/stars/${APP_CONFIG.github.owner}/${APP_CONFIG.github.repo}?style=social`}
									alt="GitHub stars"
									className="ml-2 h-6"
								/>
							</Link>
						</li>
					</ul>
				</div>
			</div>
		</header>
	);
}
