import { SiApple, SiLinux } from "@icons-pack/react-simple-icons";
import WindowsIcon from "./../../../../components/WindowsIcon";

const platformIcons = {
	macos: <SiApple className="text-white" />,
	windows: <WindowsIcon className="text-white" />,
	linux: <SiLinux className="text-white" />,
};

export default function PlatformIcon({ platform }: { platform: string }) {
	return (
		<div className="text-white">
			{platformIcons[platform as keyof typeof platformIcons]}
		</div>
	);
}
