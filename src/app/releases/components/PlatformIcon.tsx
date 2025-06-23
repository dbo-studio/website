import WindowsIcon from "@/src/components/WindowsIcon";
import { SiApple, SiLinux } from "@icons-pack/react-simple-icons";
import { HardDriveDownload } from "lucide-react";

export default function PlatformIcon({ name }: { name: string }) {
	const lowerCaseName = name.toLowerCase();
	if (lowerCaseName.includes(".exe")) {
		return <WindowsIcon />;
	}
	if (lowerCaseName.includes(".dmg")) {
		return <SiApple className="w-5 h-5 text-gray-500" />;
	}
	if (lowerCaseName.includes(".deb") || lowerCaseName.includes(".appimage")) {
		return <SiLinux className="w-5 h-5 text-yellow-500" />;
	}
	return <HardDriveDownload className="w-5 h-5 text-gray-400" />;
}
