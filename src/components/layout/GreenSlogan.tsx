"use client";

import Image from "next/image";

export default function GreenSlogan() {
	return (
		<div className="flex items-center justify-center relative w-full h-32 bg-[url('/brush.jpg')] bg-center bg-cover">
			<div className="font-cursive text-2xl font-bold text-black">
				WHERE GREEN
			</div>
			<div className="mx-2.5">
				<Image
					src="/plant.png" // Replace with your plant image path
					alt="Potted plant"
					width={80}
					height={80}
					className="object-contain"
				/>
			</div>
			<div className="font-cursive text-2xl font-bold text-black">
				GROWS AND BE CHERISHED
			</div>
		</div>
	);
}
