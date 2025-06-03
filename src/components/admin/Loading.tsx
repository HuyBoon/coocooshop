import React from "react";

const Loading = () => {
	return (
		<div className="flex items-center justify-center bg-transparent ">
			<div className="relative w-12 h-12">
				{/* <div className="absolute inset-0 rounded-full border-4 border-solid border-purple-500 border-t-transparent animate-spin-slow" />{" "} */}
				<div className="absolute inset-2 rounded-full bg-gradient-to-r from-pink-500 via-yellow-400 to-green-500 animate-pulse-fast" />{" "}
				<div className="absolute inset-4 rounded-full border-2 border-solid border-blue-400 border-b-transparent animate-spin-reverse-slow" />
			</div>
		</div>
	);
};

export default Loading;
