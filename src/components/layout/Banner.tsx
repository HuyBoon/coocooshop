"use client";
import React from "react";
import Image from "next/image";

const Banner = () => {
	return (
		<section className="relative w-full h-auto">
			{/* Desktop Image */}
			<Image
				src="/banner.svg"
				alt="Desktop Banner"
				width={1920}
				height={800}
				className="hidden md:block w-full h-[800px] object-cover"
				priority
			/>
			{/* Mobile Image */}
			<Image
				src="/bannerdienthoai.svg"
				alt="Mobile Banner"
				width={600}
				height={600}
				className="block md:hidden w-full h-[600px] object-cover"
				priority
			/>
			{/* Text Overlay */}
			<div className="absolute top-[20%] left-1/2 transform -translate-x-1/2 text-center">
				<h2 className="text-4xl md:text-6xl lg:text-7xl font-bold text-black drop-shadow-lg">
					behind our PLANT
				</h2>
			</div>
		</section>
	);
};

export default Banner;
