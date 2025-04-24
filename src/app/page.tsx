import Image from "next/image";
import { Play, ChevronRight, Check } from "lucide-react";
import { CustomCarousel } from "@/components/ui/CustomCarousel";
import Link from "next/link";
import HotProduct from "@/components/layout/HotProduct";
import Header from "@/components/layout/Header";
import Banner from "@/components/layout/Banner";

const services = [
	"Design Themed Gardens",
	"Garden Design & Planning",
	"Tree & Shrub Planting",
	"Landscape Architecture",
	"Pest & Disease Management",
	"Soil & Fertilization",
	"Water Irrigation Work",
	"Watering Solutions",
];

export default function Home() {
	return (
		<>
			<Header />
			<Banner />
		</>
	);
}
