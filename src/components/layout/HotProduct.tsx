"use client";
import React, { useRef } from "react";
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
	{ src: "/images/product4.jpg", alt: "Plant 4" },
	{ src: "/images/product5.jpg", alt: "Plant 5" },
];

const HotProduct = () => {
	return (
		<section className="relative w-full mt-[-10%] z-20">
			<h2 className="text-center text-3xl font-bold text-white mb-[-4rem] z-30 relative">
				PRODUCT
			</h2>

			<div className="relative px-8">
				{/* Swiper controls */}
				<div
					className="cursor-pointer  swiper-button-prev-custom absolute left-[2%] top-1/2 -translate-y-1/2 z-30"
					id="prevBtn"
				>
					<Leaf className="w-9 h-9  rotate-[-135deg] bg-slate-700 hover:bg-green-100 hover:text-green-600 rounded-full p-2 transition-all" />
				</div>
				<div
					className="cursor-pointer swiper-button-next-custom absolute right-[2%] top-1/2 -translate-y-1/2 z-30"
					id="nextBtn"
				>
					<Leaf className="w-9 h-9 rotate-[45deg] bg-slate-700 hover:bg-green-100 hover:text-green-600 rounded-full p-2 transition-all" />
				</div>

				<Swiper
					modules={[Navigation]}
					navigation={{
						prevEl: "#prevBtn",
						nextEl: "#nextBtn",
					}}
					slidesPerView={3}
					centeredSlides={true}
					loop={true}
					spaceBetween={20}
					className="group w-[90%] mx-auto"
				>
					{products.map((product, idx) => (
						<SwiperSlide key={idx}>
							<div className="group hover:w-[50%] transition-all duration-500 ease-in-out">
								<div
									className={`relative mx-auto overflow-hidden rounded-xl cursor-pointer
                    ${idx === 1 ? "h-[180px]" : "h-[280px]"}
                    group-hover:scale-105 transition-all`}
								>
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
			</div>
		</section>
	);
};

export default HotProduct;
