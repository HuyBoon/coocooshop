import Image from "next/image";
import { Play, ChevronRight, Check } from "lucide-react";
import { CustomCarousel } from "@/components/ui/CustomCarousel";
import Link from "next/link";
import HotProduct from "@/components/layout/HotProduct";
import Header from "@/components/layout/Header";
import Banner from "@/components/layout/Banner";

export default function Home() {
	return (
		<>
			<Header />
			<Banner />
			<HotProduct />
		</>
	);
}
