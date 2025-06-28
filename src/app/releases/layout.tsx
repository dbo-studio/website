"use client";

import Footer from "@/src/components/layout/footer";
import Header from "@/src/components/layout/header";
import { useEffect } from "react";

import AOS from "aos";
import "aos/dist/aos.css";

export default function ReleasesLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	useEffect(() => {
		AOS.init({
			once: true,
			disable: "phone",
			duration: 700,
			easing: "ease-out-cubic",
		});
	});

	return (
		<>
			<Header />
			<main className="grow">{children}</main>
			<Footer />
		</>
	);
}
