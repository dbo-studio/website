"use client";

import Slide1 from "@/public/images/slide-1.png";
import Slide2 from "@/public/images/slide-2.png";
import Slide3 from "@/public/images/slide-3.png";
import Slide4 from "@/public/images/slide-4.png";
import Image from "next/image";
import "swiper/css";
import "swiper/css/effect-fade";

import { EffectFade } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";
export default function Carousel() {
	return (
		<Swiper
			autoplay={true}
			effect="fade"
			modules={[EffectFade]}
			spaceBetween={50}
			slidesPerView={1}
		>
			<SwiperSlide>
				<Image src={Slide1} alt="Slide 1" />
			</SwiperSlide>
			<SwiperSlide>
				<Image src={Slide2} alt="Slide 2" />
			</SwiperSlide>
			<SwiperSlide>
				<Image src={Slide3} alt="Slide 3" />
			</SwiperSlide>
			<SwiperSlide>
				<Image src={Slide4} alt="Slide 4" />
			</SwiperSlide>
		</Swiper>
	);
}
