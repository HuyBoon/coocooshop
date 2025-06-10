"use client";

import { usePathname } from "next/navigation";
import Link from "next/link";
import {
	LayoutDashboard,
	NotebookPen,
	Settings,
	Shapes,
	UsersRound,
	ChevronDown,
	ChevronRight,
	Dribbble,
	Video,
	FileText,
	Layout,
} from "lucide-react";
import { AiOutlineMenuFold, AiOutlineMenuUnfold } from "react-icons/ai";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface NavLink {
	url: string;
	label: string;
	icon: React.ReactNode;
	submenu?: { url: string; label: string }[];
}

export default function AsideCustomer({
	collapsed,
	setCollapsed,
	onSelect,
}: {
	collapsed: boolean;
	setCollapsed: React.Dispatch<React.SetStateAction<boolean>>;
	onSelect?: () => void;
}) {
	const pathname = usePathname();
	const [openMenus, setOpenMenus] = useState<Record<string, boolean>>({});

	const toggleMenu = (label: string) => {
		setOpenMenus((prev) => ({
			...prev,
			[label]: !prev[label],
		}));
	};

	// Cấu trúc menu được tối ưu hóa
	const navLinks: NavLink[] = [
		{
			url: "/admin/dashboard",
			icon: <LayoutDashboard size={20} />,
			label: "Dashboard",
		},
		{
			url: "/admin/manageproducts",
			icon: <Shapes size={20} />,
			label: "Products",
			submenu: [
				{
					url: "/admin/manageproducts/categories",
					label: "Categories",
				},
				{
					url: "/admin/manageproducts/products",
					label: "Plants",
				},
			],
		},
		{
			url: "/admin/manageblogs",
			icon: <NotebookPen size={20} />,
			label: "Blogs",
			submenu: [
				{
					url: "/admin/manageblogs/category",
					label: "Categories",
				},
				{
					url: "/admin/manageblogs/blogs",
					label: "BlogPost",
				},
			],
		},

		{
			url: "/admin/users",
			icon: <UsersRound size={20} />,
			label: "Users",
		},
		{
			url: "/admin/media",
			icon: <Video size={20} />,
			label: "Media",
		},
		{
			url: "/admin/settings",
			icon: <Settings size={20} />,
			label: "Settings",
		},
	];

	const isActive = (url: string) =>
		pathname === url || pathname.startsWith(url + "/");

	// Animation variants đồng bộ duration
	const sidebarVariants = {
		expanded: { width: "16rem" }, // 256px
		collapsed: { width: "4rem" }, // 64px
	};

	const textVariants = {
		expanded: { opacity: 1, x: 0 },
		collapsed: { opacity: 0, x: -20 },
	};

	const submenuVariants = {
		expanded: { height: "auto", opacity: 1 },
		collapsed: { height: 0, opacity: 0 },
	};

	// Đồng bộ duration cho tất cả hiệu ứng
	const animationDuration = 0.5;

	return (
		<motion.aside
			className="fixed left-0 top-0 shadow-md z-30 min-h-screen overflow-y-auto bg-light border-r border-slate-200 "
			initial={collapsed ? "collapsed" : "expanded"}
			animate={collapsed ? "collapsed" : "expanded"}
			variants={sidebarVariants}
			transition={{ duration: animationDuration, ease: "easeInOut" }}
		>
			{/* Header top bar */}
			<div className="flex items-center justify-between px-3 py-3 border-b border-slate-200  relative">
				<motion.h1
					className={`mx-auto font-bold text-2xl text-secondary  transition-all ${
						collapsed ? "opacity-0 w-0 overflow-hidden" : "opacity-100"
					}`}
					variants={textVariants}
					transition={{ duration: animationDuration }}
				>
					COOCOO
				</motion.h1>
				<span
					onClick={() => setCollapsed(!collapsed)}
					className="cursor-pointer text-primary p-1 rounded hover:bg-slate-200  transition-all "
				>
					{collapsed ? (
						<AiOutlineMenuUnfold size={22} />
					) : (
						<AiOutlineMenuFold size={22} />
					)}
				</span>
			</div>
			{/* Navigation menu */}
			<div className="flex-grow h-[calc(100vh-130px)] mt-2 overflow-y-auto">
				<ul className="space-y-1 px-2">
					{navLinks.map((item) => {
						const isItemActive = isActive(item.url);
						const hasSubmenu = item.submenu && item.submenu.length > 0;

						return (
							<li key={item.url} className="relative group">
								<div
									className={`flex items-center justify-between gap-2 rounded-md px-2 py-4 cursor-pointer transition-colors ${
										isItemActive
											? "bg-accent text-primary font-semibold"
											: "hover:bg-slate-100  text-slate-700"
									}`}
								>
									<Link
										href={item.url}
										className="flex items-center gap-3 w-full"
										onClick={onSelect}
									>
										{item.icon}
										<AnimatePresence>
											{!collapsed && (
												<motion.span
													className="text-sm"
													initial={{ opacity: 0, x: -10 }}
													animate={{ opacity: 1, x: 0 }}
													exit={{ opacity: 0, x: -10 }}
													transition={{ duration: animationDuration }}
												>
													{item.label}
												</motion.span>
											)}
										</AnimatePresence>
									</Link>

									{hasSubmenu && !collapsed && (
										<button
											onClick={() => toggleMenu(item.label)}
											className="ml-auto hover:text-slate-700 "
										>
											{openMenus[item.label] ? (
												<ChevronDown size={16} />
											) : (
												<ChevronRight size={16} />
											)}
										</button>
									)}
								</div>

								{/* Tooltip for collapsed */}
								{collapsed && (
									<span className="fixed z-50 left-16 ml-1 top-auto translate-y-[-50%] text-white bg-slate-900 text-xs px-2 py-1 rounded shadow-md whitespace-nowrap pointer-events-none group-hover:opacity-100 opacity-0 transition-all duration-200">
										{item.label}
									</span>
								)}

								{/* Submenu */}
								<AnimatePresence>
									{hasSubmenu && openMenus[item.label] && !collapsed && (
										<motion.ul
											className="ml-7 mt-1 space-y-1"
											variants={submenuVariants}
											initial="collapsed"
											animate="expanded"
											exit="collapsed"
											transition={{ duration: animationDuration }}
										>
											{item.submenu?.map((sub) => (
												<li key={sub.url}>
													<Link
														href={sub.url}
														onClick={onSelect}
														className={`block px-2 py-2 rounded-md text-sm transition-colors ${
															isActive(sub.url)
																? "bg-accent text-primary font-medium"
																: "text-slate-600  hover:bg-slate-100 "
														}`}
													>
														{sub.label}
													</Link>
												</li>
											))}
										</motion.ul>
									)}
								</AnimatePresence>
							</li>
						);
					})}
				</ul>
			</div>
			{/* Footer top bar */}
			<div className="px-4 border-t border-slate-200 ">
				<motion.h4
					className="text-center font-bold text-sm text-secondary pt-4 "
					variants={textVariants}
					transition={{ duration: animationDuration }}
				>
					© 2025 CooCoo
				</motion.h4>
			</div>
		</motion.aside>
	);
}
