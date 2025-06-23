import { SiArm, SiIntel } from "@icons-pack/react-simple-icons";
import { Cpu } from "lucide-react";

export default function ArchInfo({ name }: { name: string }) {
	const lowerCaseName = name.toLowerCase();
	if (lowerCaseName.includes("arm64") || lowerCaseName.includes("aarch64")) {
		return (
			<div className="flex items-center gap-1.5">
				<SiArm className="w-4 h-4 text-gray-500" />
				<span className="text-xs text-gray-600">ARM64</span>
			</div>
		);
	}
	if (lowerCaseName.includes("intel") || lowerCaseName.includes("x64")) {
		return (
			<div className="flex items-center gap-1.5">
				<SiIntel className="w-4 h-4 text-gray-500" />
				<span className="text-xs text-gray-600">Intel x64</span>
			</div>
		);
	}
	return (
		<div className="flex items-center gap-1.5">
			<Cpu className="w-4 h-4 text-gray-400" />
			<span className="text-xs text-gray-600">Universal</span>
		</div>
	);
}
