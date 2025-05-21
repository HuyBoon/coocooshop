"use client";
import React from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import Image from "next/image";
import { Leaf } from "lucide-react";

const products = [
	{ src: "/images/product1.jpg", alt: "Plant 1" },
	{ src: "/images/product2.jpg", alt: "Plant 2" },
	{ src: "/images/product3.jpg", alt: "Plant 3" },
];

const HotProduct = () => {
	const toAllTours = () => {
		// Placeholder for navigation logic, e.g., router.push('/tours');
		console.log("Navigating to all tours");
	};

	return (
		<section className="relative w-full mt-[-10%] z-20">
			<h2 className="text-center text-3xl font-bold text-white mb-[-4rem] z-30 relative">
				PRODUCT
			</h2>

			<div className="relative px-8">
				<Swiper
					modules={[Navigation]}
					spaceBetween={15}
					slidesPerView={1}
					navigation={{
						nextEl: ".destination-card2-next",
						prevEl: ".destination-card2-prev",
					}}
					speed={2000}
					breakpoints={{
						480: { slidesPerView: 1 },
						576: { slidesPerView: 2 },
						768: { slidesPerView: 3 },
						1024: { slidesPerView: 3 },
					}}
					centeredSlides={true}
					loop={true}
					className="group w-[90%] mx-auto mb-[50px]"
				>
					{products.map((product, idx) => (
						<SwiperSlide key={idx} className={idx % 2 !== 0 ? "mt-[50px]" : ""}>
							<div className="transition-all duration-500 ease-in-out aspect-[4/3]">
								<div className="relative overflow-hidden rounded-xl">
									<Image
										src={product.src}
										alt={product.alt}
										fill
										className="object-cover rounded-xl"
									/>
								</div>
							</div>
						</SwiperSlide>
					))}
				</Swiper>

				{/* Swiper controls */}
				<div className="flex items-center justify-between px-8">
					<div className="flex items-center gap-5 max-w-[162px] w-full">
						<div
							className="slider-btn destination-card2-prev swiper-button-prev text-primary flex items-center gap-2 cursor-pointer"
							role="button"
							aria-label="Previous slide"
						>
							<Leaf className="w-6 h-6 rotate-[-135deg]" />
							<span className="uppercase">PREV</span>
						</div>
						<div
							className="slider-btn destination-card2-next swiper-button-next text-primary flex items-center gap-2 cursor-pointer"
							role="button"
							aria-label="Next slide"
						>
							<span className="uppercase">NEXT</span>
							<Leaf className="w-6 h-6 rotate-[45deg]" />
						</div>
					</div>
					<button
						onClick={() => toAllTours()}
						className="secondary-btn2 text-white"
					>
						View All Tours
					</button>
				</div>
			</div>
		</section>
	);
};

export default HotProduct;
