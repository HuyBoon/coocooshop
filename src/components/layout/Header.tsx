"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

import Image from "next/image";
import {
	CircleUser,
	LayoutGrid,
	Plane,
	Search,
	TreePalm,
	User,
} from "lucide-react";

export default function Header() {
	const [navbar, setNavbar] = useState(false);
	const [mobileOpen, setMobileOpen] = useState(false);

	const navLinks = [
		{ href: `/sanpham`, label: "Sản phẩm" },
		{ href: `/blog`, label: "Blog" },
		{ href: `/gioithieu`, label: "Giới thiệu" },
		{ href: `/lienhe`, label: "Liên hệ" },
	];
	const changeBackground = () => {
		setNavbar(window.scrollY >= 10);
	};

	useEffect(() => {
		window.addEventListener("scroll", changeBackground);
		return () => window.removeEventListener("scroll", changeBackground);
	}, []);

	return (
		<header
			className={`fixed w-full left-0 z-[999] transition-all duration-900  ${
				navbar ? "top-0 " : "top-[30px]"
			}`}
		>
			<div
				className={`w-[95%] mx-auto flex items-center justify-between rounded-4xl border px-4 py-3 transition-all duration-700 ${
					navbar
						? "bg-[rgba(0,0,0,0.8)] backdrop-blur-xs shadow-lg"
						: "bg-[rgba(255,255,255,0.2)] backdrop-blur-md"
				}`}
			>
				{/* Logo */}
				<Link
					href="/"
					className="flex items-center gap-2 text-xl font-bold text-primary"
				>
					<TreePalm size={30} className="text-[#63ab45]" />
					<h1 className="font-bold">COOCOO</h1>
				</Link>

				{/* Desktop Nav */}
				<nav className="hidden lg:flex items-center gap-6 text-gray-700 dark:text-gray-200">
					{navLinks.map((link) => (
						<Link
							key={link.label}
							href={link.href}
							className="hover:text-primary transition-colors"
						>
							{link.label}
						</Link>
					))}
				</nav>

				{/* Right placeholder */}
				<div className="flex items-center gap-3">
					{/* Login Icon */}
					<div>
						<Search size={24} className="cursor-pointer" />
					</div>
					<div>
						<CircleUser size={24} className="cursor-pointer" />
					</div>
				</div>
			</div>
		</header>
	);
}
