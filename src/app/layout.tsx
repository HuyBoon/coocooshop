import type { Metadata } from "next";
import { Lora, Satisfy } from "next/font/google";
import "./globals.css";
import { AppProvider } from "@/components/AppContext";
import { Toaster } from "sonner";

export const metadata: Metadata = {
	title: "COOCOO SHOP",
	description: "Nature is the best medicine",
};

const lora = Lora({
	subsets: ["latin"],
	weight: ["400", "500", "600", "700"],
	variable: "--font-lora",
	display: "swap",
});

const satify = Satisfy({
	subsets: ["latin"],
	weight: ["400"],
	variable: "--font-satify",
	display: "swap",
});

export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<html lang="en">
			<body className={`${lora.variable}  antialiased`}>
				<AppProvider>{children}</AppProvider>
				<Toaster richColors position="top-right" />
			</body>
		</html>
	);
}
