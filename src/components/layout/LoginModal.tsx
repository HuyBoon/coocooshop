"use client";

import { signIn, getSession } from "next-auth/react";
import { X } from "lucide-react";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import { useUser } from "@/components/AppContext";
import Loader from "@/components/admin/Loader";

interface LoginModalProps {
	onClose: () => void;
}

const LoginModal = ({ onClose }: LoginModalProps) => {
	const [closing, setClosing] = useState(false);
	const [tab, setTab] = useState<"signIn" | "register">("signIn");

	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState("");

	const router = useRouter();
	const { status } = useUser();

	useEffect(() => {
		if (status === "authenticated") {
			onClose(); // Close modal
			router.push("/admin/dashboard");
		}
	}, [status, router, onClose]);

	const handleClose = () => {
		setClosing(true);
	};

	useEffect(() => {
		if (closing) {
			const timer = setTimeout(() => {
				onClose();
			}, 500);
			return () => clearTimeout(timer);
		}
	}, [closing, onClose]);

	const handleLogin = async (ev: React.FormEvent<HTMLFormElement>) => {
		ev.preventDefault();
		setLoading(true);
		setError("");

		const result = await signIn("credentials", {
			email,
			password,
			redirect: false,
		});

		if (result?.error) {
			setError("Invalid email or password. Please try again.");
			setLoading(false);
			return;
		}

		const session = await getSession();
		if (session) {
			router.push(session.user?.admin ? "/admin/dashboard" : "/login");
			onClose(); // Close modal after successful login
		} else {
			setError("Failed to retrieve session. Please try again.");
		}
		setLoading(false);
	};

	if (status === "loading") {
		return (
			<div className="fixed inset-0 z-[1000] flex items-center justify-center bg-black/10">
				<Loader />
			</div>
		);
	}

	return (
		<div className="fixed inset-0 z-[1000] overflow-y-auto flex items-start justify-center pt-10">
			<div
				className="absolute top-0 left-0 right-0 bottom-0 min-h-full bg-black/5 backdrop-blur-xs"
				onClick={handleClose}
			/>
			<div
				className={`relative bg-white font-rubik w-[90%] max-w-lg rounded-lg shadow-xl transition-transform duration-500 ${
					closing ? "modal-zoom-exit" : "modal-zoom-enter"
				}`}
			>
				<div className="w-full h-30 relative">
					<Image
						src="/banner.jpg"
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

				<div className="px-6 py-4">
					{tab === "signIn" ? (
						<>
							<h2 className="text-2xl font-bold text-center mb-2">
								Sign in to continue
							</h2>
							<p className="text-center text-gray-500 mb-6 text-sm">
								Enter your email and password.
							</p>

							{error && (
								<p className="bg-red-100 text-red-600 p-2 rounded-md text-center mb-4 text-sm">
									{error}
								</p>
							)}

							<form onSubmit={handleLogin} className="space-y-4">
								<input
									type="email"
									value={email}
									onChange={(e) => setEmail(e.target.value)}
									placeholder="Email *"
									className="w-full px-4 py-2 border rounded-full focus:outline-none focus:ring-2 focus:ring-black"
									required
								/>
								<input
									type="password"
									value={password}
									onChange={(e) => setPassword(e.target.value)}
									placeholder="Password *"
									className="w-full px-4 py-2 border rounded-full focus:outline-none focus:ring-2 focus:ring-black"
									required
								/>

								<button
									type="submit"
									disabled={loading}
									className={`w-full px-4 py-2 rounded-full font-semibold transition ${
										loading
											? "bg-gray-400 text-white"
											: "bg-black text-white hover:bg-gray-900"
									}`}
								>
									{loading ? "Logging in..." : "Sign In"}
								</button>
							</form>

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
						// Register UI (unchanged)
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
