import type { Asset } from "@/src/lib/schema";
import type { ReactElement } from "react";

export type Platform = {
	key: PlatformKey;
	name: string;
	arch: string;
	icon: ReactElement;
	asset?: Asset;
};

export type PlatformKey =
	| "macos-arm"
	| "macos-intel"
	| "windows"
	| "linux"
	| "appimage";
