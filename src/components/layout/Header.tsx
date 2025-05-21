"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import {
	CircleUser,
	LayoutGrid,
	Plane,
	Search,
	Sprout,
	TreePalm,
	User,
} from "lucide-react";
import { usePathname } from "next/navigation";
import LoginModal from "./LoginModal";
import MobileNav from "./MobileNav";

export default function Header() {
	const pathname = usePathname();
	const [navbar, setNavbar] = useState(false);
	const [mobileOpen, setMobileOpen] = useState(false);
	const [sidebar, setSidebar] = useState(false);
	const [modalLogin, setModalLogin] = useState(false);

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
			className={`fixed w-full left-0 z-[999] transition-all duration-900 ${
				navbar ? "top-0 " : "top-[30px]"
			}`}
		>
			<div
				className={`w-[96%] h-[64px] px-[20px] xl:px-[2%] mx-auto flex items-center justify-between rounded-4xl transition-all duration-800 border border-white-15 backdrop-blur-[1.5px] ${
					navbar ? "bg-header-dark" : "bg-header-light"
				}`}
			>
				{/* Logo */}
				<Link
					href="/"
					className="flex items-center gap-2 text-xl font-bold text-primary"
				>
					<Sprout size={30} className="text-primary" />
					<h1 className="font-lora text-white">COO COO</h1>
				</Link>

				{/* Desktop Nav */}
				<nav className="hidden lg:flex items-center gap-10 text-white">
					{navLinks.map((link) => (
						<Link
							key={link.label}
							href={link.href}
							className={`hover:text-primary transition-colors uppercase text-[14px] ${
								pathname === link.href
									? "text-primary"
									: navbar
									? "text-white"
									: "text-black"
							}`}
						>
							{link.label}
						</Link>
					))}
				</nav>

				{/* Right placeholder */}
				<div className="h-16 flex items-center justify-items-end">
					<div className="h-full flex items-center px-4">
						<Search
							size={25}
							className="text-white cursor-pointer hover:text-primary"
							onClick={() => setSidebar(!sidebar)}
						/>
					</div>
					<div className="h-full flex items-center">
						<User
							size={25}
							className="text-white cursor-pointer hover:text-primary"
							onClick={() => setModalLogin(!modalLogin)}
						/>
					</div>
				</div>
			</div>

			{/* Mobile Nav */}
			{mobileOpen && <MobileNav onClose={() => setMobileOpen(false)} />}
			{/* Sidebar */}
			{/* Login modal */}
			{modalLogin && <LoginModal onClose={() => setModalLogin(false)} />}
		</header>
	);
}
