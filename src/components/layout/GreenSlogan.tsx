"use client";

import Image from "next/image";

export default function GreenSlogan() {
	return (
		<div className="flex items-center justify-center relative w-full">
			<div>
				<Image
					src="/separate.png"
					alt="Potted plant"
					width={1900}
					height={1080}
					className="object-cover"
				/>
			</div>
		</div>
	);
}
