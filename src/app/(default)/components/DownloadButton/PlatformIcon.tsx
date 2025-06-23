import Image from "next/image";

const platformIcons = {
	macos: "/images/apple-logo.svg",
	windows: "/images/windows-logo.svg",
	linux: "/images/linux-logo.png",
};

export default function PlatformIcon({ platform }: { platform: string }) {
	console.log("🚀 ~ PlatformIcon ~ platform:", platform);
	return (
		<Image
			src={platformIcons[platform as keyof typeof platformIcons]}
			alt={platform}
			width={16}
			height={16}
		/>
	);
}
