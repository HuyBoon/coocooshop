"use client";
import React, { useState } from "react";
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
	{ src: "/images/product2.jpg", alt: "Plant 2" },
	{ src: "/images/product3.jpg", alt: "Plant 3" },
];

const HotProduct = () => {
	const [activeIndex, setActiveIndex] = useState(1);
	const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

	return (
		<section className="relative container w-full mx-auto mt-[-10%] z-20">
			{/* Title */}
			<div className="absolute top-[-3%] left-1/2 transform -translate-x-1/2 text-center px-[40px] py-[20px] rounded-2xl bg-gradient-to-b from-[#18392b] to-[#212224]  border border-white z-30">
				<h1 className="text-white text-[50px] font-bold">PRODUCT</h1>
			</div>

			<div className="relative w-full px-3 overflow-visible">
				<Swiper
					onSlideChange={(swiper) => setActiveIndex(swiper.realIndex)}
					modules={[Navigation]}
					slidesPerView={1}
					centeredSlides
					loop
					navigation={{
						nextEl: ".card2-next",
						prevEl: ".card2-prev",
					}}
					speed={1500}
					spaceBetween={15}
					breakpoints={{
						480: { slidesPerView: 1 },
						768: { slidesPerView: 3 },
					}}
					className="w-[85%] mx-auto mb-[50px]"
				>
					{products.map((product, idx) => {
						const isActive = idx === activeIndex;
						const isHovered = idx === hoveredIndex;
						const isOtherHovered = hoveredIndex !== null && !isHovered;

						return (
							<SwiperSlide key={idx}>
								<div
									className={`group relative h-full transition-all duration-500 ease-in-out`}
									onMouseEnter={() => setHoveredIndex(idx)}
									onMouseLeave={() => setHoveredIndex(null)}
									style={{
										transition: "flex 0.5s ease",
										display: "flex",
										flexDirection: "column",
										flex: hoveredIndex === null ? 1 : isHovered ? 2 : 1, // hovered slide gets more flex
									}}
								>
									<div
										className={`aspect-[3/4] overflow-hidden rounded-2xl border border-white transition-all duration-500 ${
											isActive ? "mt-[80px]" : "mt-0"
										}`}
									>
										<Image
											src={product.src}
											alt={product.alt}
											width={800}
											height={600}
											className="object-cover rounded-2xl w-full h-full"
										/>
									</div>
								</div>
							</SwiperSlide>
						);
					})}
				</Swiper>

				{/* Prev Button */}
				<div className="absolute top-1/2 left-[15px] -translate-y-1/2 z-10">
					<button
						className="card2-prev bg-white cursor-pointer shadow-lg w-12 h-12 rounded-full flex items-center justify-center hover:bg-[#e98585] hover:text-white transition-all duration-300"
						aria-label="Previous slide"
					>
						<Leaf className="w-6 h-6 rotate-[-135deg] text-primary" />
					</button>
				</div>

				{/* Next Button */}
				<div className="absolute top-1/2 right-[15px] -translate-y-1/2 z-10">
					<button
						className="card2-next bg-white cursor-pointer shadow-lg w-12 h-12 rounded-full flex items-center justify-center hover:bg-[#e98585] hover:text-white transition-all duration-300"
						aria-label="Next slide"
					>
						<Leaf className="w-6 h-6 rotate-[45deg] text-primary" />
					</button>
				</div>
			</div>
		</section>
	);
};

export default HotProduct;
