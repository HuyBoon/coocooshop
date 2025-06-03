import React from "react";
import { Leaf } from "lucide-react";

const Loader = () => {
	return (
		<div className="flex items-center justify-center h-full bg-transparent">
			<div className="animate-spin-slow p-3 rounded-full border-4 border-green-500 border-t-transparent">
				<Leaf className="text-green-600 w-6 h-6" />
			</div>
		</div>
	);
};

export default Loader;
