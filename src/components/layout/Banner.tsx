"use client";
import React from "react";
import Image from "next/image";

const Banner = () => {
	return (
		<section className="relative w-full h-auto">
			<div className="aspect-[16/9] overflow-hidden hidden md:block">
				<Image
					src="/banner.png"
					alt="Desktop Banner"
					width={1920}
					height={1080}
					className=" w-full object-cover"
					priority
				/>
			</div>
			{/* Mobile Image */}
			<div className="aspect-[9/16] overflow-hidden md:hidden ">
				<Image
					src="/bannerdt.png"
					alt="Mobile Banner"
					width={768}
					height={768}
					className="block w-full  object-cover"
					priority
				/>
			</div>
			{/* Text Overlay */}
			<div className="absolute top-[20%] left-1/2 transform -translate-x-1/2 text-center">
				<h2 className="text-4xl font-satify md:text-6xl lg:text-7xl font-bold text-slate-500 drop-shadow-lg">
					CooCoo
				</h2>
			</div>
		</section>
	);
};

export default Banner;
