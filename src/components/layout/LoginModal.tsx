"use client";
import { X } from "lucide-react";

import Image from "next/image";
import { usePathname } from "next/navigation";
import React, { useEffect, useState } from "react";

interface LoginModalProps {
	onClose: () => void;
}

const LoginModal = ({ onClose }: LoginModalProps) => {
	const pathname = usePathname();

	const [closing, setClosing] = useState(false);
	const [tab, setTab] = useState<"signIn" | "register">("signIn");
	const handleClose = () => {
		setClosing(true);
	};

	useEffect(() => {
		if (closing) {
			const timer = setTimeout(() => {
				onClose();
			}, 500); // thời gian đúng bằng thời gian animation exit
			return () => clearTimeout(timer);
		}
	}, [closing, onClose]);

	return (
		<div className="fixed inset-0 z-[1000] overflow-y-auto flex items-start justify-center pt-10">
			{/* pt-20 để modal cách top */}
			<div
				className="absolute top-0 left-0 right-0 bottom-0 min-h-full bg-black/5 backdrop-blur-xs"
				onClick={handleClose}
			/>
			<div
				className={`relative bg-white font-rubik w-[90%] max-w-lg rounded-lg shadow-xl transition-transform duration-500 
                    ${closing ? "modal-zoom-exit" : "modal-zoom-enter"}`}
			>
				<div className="w-full h-30 relative">
					<Image
						src="/banner.jpg" // bạn nhớ đổi đúng đường dẫn hoặc import ảnh
						alt="Login Banner"
						fill
						className="object-cover"
					/>
					<button
						onClick={handleClose}
						aria-label="Close"
						className="absolute top-4 right-4 p-2 rounded-full bg-gray-100 cursor-pointer transition-transform duration-300 hover:rotate-45"
					>
						<X size={20} />
					</button>
				</div>

				{/* Nội dung modal */}

				<div className="px-6 py-2">
					{tab === "signIn" ? (
						<>
							<h2 className="text-2xl font-bold text-center mb-2">
								Sign in to continue
							</h2>
							<p className="text-center text-gray-500 mb-6 text-sm">
								Enter your email address for Login.
							</p>

							<input
								type="email"
								placeholder="User Name Or Email *"
								className="w-full px-4 py-2 mb-4 border rounded-full focus:outline-none focus:ring-2 focus:ring-black"
							/>

							<button className="w-full px-4 py-2  bg-black text-white rounded-full font-semibold hover:bg-gray-900 transition ">
								Sign In
							</button>

							<div className="flex items-center my-4">
								<div className="flex-1 h-px bg-gray-300" />
								<span className="mx-2 text-gray-400 text-sm">or</span>
								<div className="flex-1 h-px bg-gray-300" />
							</div>

							<button className="cursor-pointer w-full bg-white border py-2 rounded-full flex items-center justify-center gap-2  transition">
								<Image src="/google.png" alt="Google" width={20} height={20} />
								<span className="text-sm text-black  font-medium">
									Sign In With Google
								</span>
							</button>

							<p className="text-center text-sm mt-6 pb-4">
								Don't have an account?{" "}
								<button
									onClick={() => setTab("register")}
									className="text-black font-semibold hover:underline"
								>
									Register
								</button>
							</p>
						</>
					) : (
						<>
							<h2 className="text-2xl font-bold text-center mb-2">
								Create an Account
							</h2>
							<p className="text-center text-gray-500 mb-6 text-sm">
								Sign up to get started!
							</p>

							<input
								type="text"
								placeholder="Full Name *"
								className="w-full px-4 py-2 mb-4 border rounded-full focus:outline-none focus:ring-2 focus:ring-black"
							/>

							<input
								type="email"
								placeholder="Email Address *"
								className="w-full px-4 py-2 mb-4 border rounded-full focus:outline-none focus:ring-2 focus:ring-black"
							/>

							<input
								type="password"
								placeholder="Password *"
								className="w-full px-4 py-2 mb-4 border rounded-full focus:outline-none focus:ring-2 focus:ring-black"
							/>

							<button className="w-full bg-black text-white py-2 rounded-full font-semibold hover:bg-gray-900 transition">
								Register
							</button>

							<p className="text-center text-sm mt-4 pb-4">
								Already have an account?{" "}
								<button
									onClick={() => setTab("signIn")}
									className="text-black font-semibold hover:underline"
								>
									Sign In
								</button>
							</p>
						</>
					)}
				</div>
			</div>
		</div>
	);
};

export default LoginModal;
