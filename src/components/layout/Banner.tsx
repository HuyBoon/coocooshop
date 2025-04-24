"use client";
import React from "react";
import Slider from "react-slick";

const bannerImages = ["/banner.jpg"];

const Banner = () => {
	const settings = {
		dots: true,
		infinite: true,
		speed: 700,
		slidesToShow: 1,
		slidesToScroll: 1,
		autoplay: true,
		autoplaySpeed: 4000,
		arrows: false,
		pauseOnHover: false,
	};

	return (
		<section className="relative w-full h-auto">
			<Slider {...settings} className="">
				{bannerImages.map((img, index) => (
					<div
						key={index}
						className="h-screen relative flex items-center justify-center text-center text-white"
					>
						<div
							className="absolute inset-0 bg-cover bg-center transition-all duration-500"
							style={{ backgroundImage: `url(${img})` }}
						/>
						<div className="absolute inset-0 bg-black/40" />
						{/* <div className="relative z-10 max-w-3xl mx-auto px-4">
							<span className="bg-yellow-400 text-green-900 px-4 py-1 rounded-full text-sm font-semibold">
								New York
							</span>
							<h1 className="mt-4 text-4xl md:text-5xl font-bold">
								Let’s Explore Your{" "}
								<span className="text-green-400 underline">Family</span> Trip.
							</h1>
							<p className="mt-6 text-lg">
								Discover the best tours, hotels, and experiences for your next
								vacation.
							</p>
							<div className="mt-8">
								<button className="bg-green-500 hover:bg-green-600 text-white px-6 py-3 rounded-xl font-semibold">
									Explore Now
								</button>
							</div>
						</div> */}
					</div>
				))}
			</Slider>
		</section>
	);
};

export default Banner;
