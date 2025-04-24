"use client";

import { useState } from "react";
import Image from "next/image";
import { Leaf } from "lucide-react";

interface CarouselImage {
	src: string;
	alt: string;
}

interface CustomCarouselProps {
	images: CarouselImage[];
}

export function CustomCarousel({ images }: CustomCarouselProps) {
	const [activeIndex, setActiveIndex] = useState(1); // Middle image is active by default
	const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

	const handlePrev = () => {
		setActiveIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1));
	};

	const handleNext = () => {
		setActiveIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1));
	};

	return (
		<div className="relative mx-auto max-w-6xl py-8">
			<div className="flex items-center justify-center">
				{images.map((image, index) => (
					<div
						key={index}
						className={`relative mx-2 transition-all duration-300 ease-in-out ${
							hoveredIndex === index ? "w-1/2" : "w-1/3"
						} ${index === 1 ? "mt-8" : "mt-0"}`}
						onMouseEnter={() => setHoveredIndex(index)}
						onMouseLeave={() => setHoveredIndex(null)}
					>
						<div className="overflow-hidden rounded-lg">
							<Image
								src={image.src || "/placeholder.svg"}
								alt={image.alt}
								width={400}
								height={500}
								className="h-[400px] w-full object-cover transition-transform duration-300 hover:scale-105"
							/>
						</div>
					</div>
				))}
			</div>

			{/* Custom Leaf Navigation Buttons */}
			<button
				onClick={handlePrev}
				className="absolute left-0 top-1/2 z-10 -translate-y-1/2 transform cursor-pointer"
				aria-label="Previous"
			>
				<Leaf />
			</button>

			<button
				onClick={handleNext}
				className="absolute right-0 top-1/2 z-10 -translate-y-1/2 transform cursor-pointer"
				aria-label="Next"
			>
				<Leaf />
			</button>
		</div>
	);
}
