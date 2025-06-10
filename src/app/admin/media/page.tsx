"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import { Plus, Trash2, X, ChevronLeft, ChevronRight } from "lucide-react";
import HeaderTitle from "@/components/admin/HeaderTitle";
import ImageManager from "@/components/admin/ImageManager";

interface UploadedImage {
	url: string;
	public_id: string;
}

interface Pagination {
	page: number;
	limit: number;
	totalImages: number;
	totalPages: number;
}

const categories = [
	"all",
	"banner",
	"product",
	"product-category",
	"blog",
	"other",
];
const IMAGES_PER_PAGE = 12;

const Gallery = () => {
	const [galleryData, setGalleryData] = useState<
		Record<string, UploadedImage[]>
	>({});
	const [pagination, setPagination] = useState<Record<string, Pagination>>({});
	const [selectedImages, setSelectedImages] = useState<string[]>([]);
	const [showModal, setShowModal] = useState(false);
	const [activeTab, setActiveTab] = useState<string>("all");

	const fetchImages = async (category: string, page: number = 1) => {
		try {
			const res = await fetch(
				`${process.env.NEXT_PUBLIC_API_URL}/api/admin/gallery?category=${category}&page=${page}&limit=${IMAGES_PER_PAGE}`
			);
			const data = await res.json();
			if (res.ok && data.success) {
				setGalleryData((prev) => ({
					...prev,
					[category]: data.images,
				}));
				setPagination((prev) => ({
					...prev,
					[category]: data.pagination,
				}));
			} else {
				setGalleryData((prev) => ({
					...prev,
					[category]: [],
				}));
				setPagination((prev) => ({
					...prev,
					[category]: {
						page,
						limit: IMAGES_PER_PAGE,
						totalImages: 0,
						totalPages: 0,
					},
				}));
			}
		} catch (err) {
			console.error(`Lỗi khi lấy ảnh cho ${category}:`, err);
			setGalleryData((prev) => ({
				...prev,
				[category]: [],
			}));
			setPagination((prev) => ({
				...prev,
				[category]: {
					page,
					limit: IMAGES_PER_PAGE,
					totalImages: 0,
					totalPages: 0,
				},
			}));
		}
	};

	useEffect(() => {
		categories.forEach((cat) => fetchImages(cat));
	}, []);

	const handleSelectImage = (publicId: string) => {
		setSelectedImages((prev) =>
			prev.includes(publicId)
				? prev.filter((id) => id !== publicId)
				: [...prev, publicId]
		);
	};

	const handleDeleteSelected = async () => {
		if (selectedImages.length === 0) return;
		try {
			const res = await fetch(
				`${process.env.NEXT_PUBLIC_API_URL}/api/admin/deleteImages`,
				{
					method: "POST",
					headers: { "Content-Type": "application/json" },
					body: JSON.stringify({ publicIds: selectedImages }),
				}
			);
			const result = await res.json();
			if (result.success) {
				categories.forEach((cat) => fetchImages(cat));
				setSelectedImages([]);
			}
		} catch (err) {
			console.error("Xoá ảnh lỗi:", err);
		}
	};

	const handlePageChange = (category: string, page: number) => {
		if (page < 1 || page > (pagination[category]?.totalPages || 1)) return;
		fetchImages(category, page);
	};

	const images = galleryData[activeTab] || [];
	const currentPagination = pagination[activeTab] || {
		page: 1,
		limit: IMAGES_PER_PAGE,
		totalImages: 0,
		totalPages: 1,
	};

	return (
		<div className="mx-auto">
			<HeaderTitle title="Quản lý Media" path="/admin" addItem="Dashboard" />
			<div className="mt-5  px-4">
				{/* Tabs và điều khiển */}
				<div className="flex items-center justify-between py-2">
					<div className="flex flex-col space-y-4">
						<div className="flex flex-wrap gap-4">
							{categories.map((cat) => (
								<button
									key={cat}
									onClick={() => setActiveTab(cat)}
									className={`capitalize px-4 py-2 text-sm rounded-md transition-all duration-200 ${
										activeTab === cat
											? "bg-secondary text-white"
											: "bg-gray-200 hover:bg-gray-300 text-gray-700"
									}`}
								>
									{cat === "all" ? "Xem tất cả" : cat.replace("-", " ")}
								</button>
							))}
						</div>
					</div>
					<div className="flex flex-col space-y-4">
						<div className="flex flex-col space-y-2">
							{selectedImages.length > 0 && (
								<button
									onClick={handleDeleteSelected}
									className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-md flex items-center gap-2"
								>
									<Trash2 size={18} />
									Xoá {selectedImages.length} ảnh
								</button>
							)}
							<button
								onClick={() => setShowModal(true)}
								className="bg-secondary hover:bg-blue-700 text-white px-4 py-2 rounded-md flex items-center gap-2"
							>
								<Plus size={18} /> Tải ảnh
							</button>
						</div>
					</div>
				</div>

				{/* Lưới ảnh */}
				<div className="mt-5">
					<h2 className="text-lg font-semibold capitalize mb-5">
						{activeTab === "all" ? "Tất cả ảnh" : activeTab.replace("-", " ")} (
						{currentPagination.totalImages} ảnh)
					</h2>
					{images.length === 0 ? (
						<p className="text-gray-500">Chưa có ảnh trong danh mục này.</p>
					) : (
						<div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 max-h-[600px] overflow-y-auto">
							{images.map((img) => (
								<div
									key={img.public_id}
									className="relative border rounded-lg overflow-hidden group bg-white"
								>
									<div className="relative w-full h-32">
										<Image
											src={img.url}
											alt={activeTab}
											fill
											className="object-cover rounded"
										/>
										<input
											type="checkbox"
											className="absolute top-2 right-2 z-10 w-5 h-5 cursor-pointer"
											checked={selectedImages.includes(img.public_id)}
											onChange={() => handleSelectImage(img.public_id)}
										/>
									</div>
									<input
										type="text"
										readOnly
										value={img.url}
										className="mt-2 text-xs text-gray-600 w-full truncate bg-gray-100 p-1 rounded border mx-2 mb-2"
										onClick={(e) => e.currentTarget.select()}
									/>
								</div>
							))}
						</div>
					)}
					{currentPagination.totalPages > 1 && (
						<div className="flex items-center justify-center gap-4 mt-4">
							<button
								onClick={() =>
									handlePageChange(activeTab, currentPagination.page - 1)
								}
								disabled={currentPagination.page <= 1}
								className="w-10 h-10 flex items-center justify-center rounded-full bg-gray-200 text-gray-700 hover:bg-gray-300 disabled:opacity-50 transition"
							>
								<ChevronLeft size={20} />
							</button>
							<span className="text-sm text-gray-600">
								{currentPagination.page} / {currentPagination.totalPages}
							</span>
							<button
								onClick={() =>
									handlePageChange(activeTab, currentPagination.page + 1)
								}
								disabled={
									currentPagination.page >= currentPagination.totalPages
								}
								className="w-10 h-10 flex items-center justify-center rounded-full bg-gray-200 text-gray-700 hover:bg-gray-300 disabled:opacity-50 transition"
							>
								<ChevronRight size={20} />
							</button>
						</div>
					)}
				</div>
			</div>

			{/* Modal Upload */}
			{showModal && (
				<div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
					<div className="bg-white rounded-lg shadow-lg p-6 w-[90%] max-w-4xl relative">
						<button
							onClick={() => setShowModal(false)}
							className="absolute top-4 right-4 bg-gray-200 hover:bg-gray-300 rounded-full p-2 text-gray-600 hover:text-red-600 transition"
						>
							<X size={20} />
						</button>
						<ImageManager
							onUploaded={() => {
								categories.forEach((cat) => fetchImages(cat));
								setShowModal(false);
							}}
						/>
					</div>
				</div>
			)}
		</div>
	);
};

export default Gallery;
