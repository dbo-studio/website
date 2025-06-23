import Link from "next/link";
import Image from "next/image";
import LogoImage from "@/public/images/logo.svg";

export default function Logo() {
	return (
		<Link href="/" className="inline-flex" aria-label="DBO Studio">
			<Image src={LogoImage} alt="DBO Studio" width={40} height={40} />
		</Link>
	);
}
