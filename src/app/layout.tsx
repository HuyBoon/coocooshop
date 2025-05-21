import type { Metadata } from "next";
import { Lora } from "next/font/google";
import "./globals.css";

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

export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<html lang="en">
			<body className={`${lora.variable}  antialiased`}>{children}</body>
		</html>
	);
}
