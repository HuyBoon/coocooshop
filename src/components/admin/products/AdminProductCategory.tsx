"use client";

import React, { useState, useEffect } from "react";
import { useForm, Controller } from "react-hook-form";
import { toast } from "sonner";
import { Save, X } from "lucide-react";
import ImageComponent from "../ImageComponent";
import { generateSlug } from "@/libs/generateSlug";

interface Category {
	_id?: string;
	name: string;
	slug: string;
	description: string;
	thumbnail: { url: string; public_id: string };
	type: string;
	parent?: string; // Parent category ID
}

interface FormData {
	name: string;
	slug: string;
	description: string;
	thumbnail: string;
	type: string;
	parent: string;
}

interface AdminProductCategoryProps {
	category?: Category;
}

export default function AdminProductCategory({
	category,
}: AdminProductCategoryProps) {
	const [thumbnailPublicId, setThumbnailPublicId] = useState<string | null>(
		null
	);

	const [parentCategories, setParentCategories] = useState<Category[]>([]);

	const {
		control,
		handleSubmit,
		reset,
		setValue,
		watch,
		formState: { errors },
	} = useForm<FormData>({
		defaultValues: {
			name: "",
			slug: "",
			description: "",
			thumbnail: "",
			type: "plant_type",
			parent: "",
		},
	});

	const name = watch("name");

	// Fetch parent categories for dropdown
	useEffect(() => {
		const fetchParentCategories = async () => {
			try {
				const response = await fetch(
					`${process.env.NEXT_PUBLIC_API_URL}/api/admincategory?page=1&limit=100`,
					{ cache: "no-store" }
				);
				const data = await response.json();
				if (data.success) {
					// Exclude the current category (if editing) from parent options
					const filteredCategories = data.categories.filter(
						(cat: Category) => cat._id !== category?._id
					);
					setParentCategories(filteredCategories || []);
				} else {
					throw new Error(data.error || "Không thể tải danh mục cha");
				}
			} catch (error: any) {
				toast.error(error.message || "Không thể tải danh mục cha");
			}
		};

		fetchParentCategories();
	}, [category?._id]);

	useEffect(() => {
		if (name) {
			setValue("slug", generateSlug(name));
		}
	}, [name, setValue]);
	// Initialize form with category data
	useEffect(() => {
		if (category) {
			try {
				reset({
					name: category.name || "",
					slug: category.slug || "",
					description: category.description || "",
					thumbnail: category.thumbnail?.url || "",
					type: category.type || "plant_type",
					parent: category.parent || "",
				});

				if (category.thumbnail?.url) {
					setThumbnailPublicId(category.thumbnail.public_id || "initial");
				}
			} catch (error) {
				console.error("Error initializing form:", error);
				toast.error("Không thể tải dữ liệu danh mục");
			}
		}
	}, [category, reset]);

	// Handle thumbnail upload
	const handleImageUploaded = (images: { url: string; publicId: string }[]) => {
		if (images.length > 0) {
			setValue("thumbnail", images[0].url);
			setThumbnailPublicId(images[0].publicId);
		}
	};

	// Handle thumbnail removal
	const handleRemoveThumbnail = async () => {
		if (!thumbnailPublicId || !watch("thumbnail")) {
			setValue("thumbnail", "");
			setThumbnailPublicId(null);
			return;
		}

		try {
			const response = await fetch(
				`${process.env.NEXT_PUBLIC_API_URL}/api/admin/deleteImages`,
				{
					method: "POST",
					headers: { "Content-Type": "application/json" },
					body: JSON.stringify({ publicIds: [thumbnailPublicId] }),
				}
			);

			const result = await response.json();
			if (!response.ok || !result.success) {
				throw new Error(result.message || "Xóa ảnh thumbnail thất bại");
			}

			setValue("thumbnail", "");
			setThumbnailPublicId(null);
			toast.success("Đã xóa ảnh thumbnail");
		} catch (error: any) {
			toast.error(error.message || "Không thể xóa ảnh thumbnail");
		}
	};

	// Handle form cancellation
	const handleCancel = async () => {
		if (thumbnailPublicId && thumbnailPublicId !== "initial") {
			try {
				const response = await fetch(
					`${process.env.NEXT_PUBLIC_API_URL}/api/admin/deleteImages`,
					{
						method: "POST",
						headers: { "Content-Type": "application/json" },
						body: JSON.stringify({ publicIds: [thumbnailPublicId] }),
					}
				);

				const result = await response.json();
				if (!response.ok || !result.success) {
					toast.error(result.message || "Lỗi khi xóa hình ảnh");
				} else if (result.deleted?.length > 0) {
					toast.success(`Đã xóa ${result.deleted.length} hình ảnh`);
				}
			} catch (error) {
				toast.error("Lỗi server khi xóa hình ảnh");
			}
		}

		reset();
		setThumbnailPublicId(null);
		window.location.href = "/admin/manageproducts/categories";
	};

	// Handle form submission
	const onSubmit = async (data: FormData) => {
		try {
			const categoryData = {
				name: data.name.trim() || undefined,
				slug: data.slug.trim() || undefined,
				description: data.description.trim() || undefined,
				thumbnail: data.thumbnail
					? { url: data.thumbnail, public_id: thumbnailPublicId || "" }
					: undefined,
				type: data.type || undefined,
				parent: data.parent || undefined,
			};

			const method = category ? "PUT" : "POST";
			const url = category
				? `${process.env.NEXT_PUBLIC_API_URL}/api/admincategory/${category._id}`
				: `${process.env.NEXT_PUBLIC_API_URL}/api/admincategory`;

			const categoryRes = await fetch(url, {
				method,
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify(categoryData),
			});

			if (!categoryRes.ok) {
				const errorData = await categoryRes.json();
				throw new Error(errorData.error || "Không thể lưu danh mục");
			}

			toast.success(
				category ? "Danh mục đã được cập nhật" : "Danh mục đã được tạo"
			);
			window.location.href = "/admin/manageproducts/categories";
		} catch (error: any) {
			console.error("Category save error:", error);
			toast.error(error.message || "Không thể lưu danh mục");
		}
	};

	return (
		<div className="shadow-xl p-8 mx-auto  bg-white rounded-lg">
			<form onSubmit={handleSubmit(onSubmit)} className="space-y-5 text-sm">
				{/* Tên danh mục */}
				<div className="space-y-1">
					<label className="block font-medium text-gray-700">
						Tên danh mục
					</label>
					<Controller
						name="name"
						control={control}
						rules={{ required: "Tên danh mục là bắt buộc" }}
						render={({ field }) => (
							<input
								{...field}
								value={field.value || ""}
								onChange={field.onChange}
								className={`w-full px-4 py-2 border ${
									errors.name ? "border-red-500" : "border-gray-300"
								} rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500`}
								placeholder="Nhập tên danh mục"
							/>
						)}
					/>
					{errors.name && (
						<p className="text-red-500 text-sm">{errors.name.message}</p>
					)}
				</div>

				{/* Slug */}
				<div className="space-y-1">
					<Controller
						name="slug"
						control={control}
						render={({ field }) => <input type="hidden" {...field} />}
					/>
				</div>

				{/* Loại danh mục */}
				<div className="space-y-1">
					<label className="block font-medium text-gray-700">
						Loại danh mục
					</label>
					<Controller
						name="type"
						control={control}
						rules={{ required: "Loại danh mục là bắt buộc" }}
						render={({ field }) => (
							<select
								{...field}
								value={field.value || ""}
								onChange={field.onChange}
								className={`w-full px-4 py-2 border ${
									errors.type ? "border-red-500" : "border-gray-300"
								} rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500`}
							>
								<option value="" disabled>
									Chọn loại danh mục
								</option>
								<option value="location">Vị trí (trong nhà, ngoài nhà)</option>
								<option value="plant_type">
									Loại cây (cây cảnh, cây ăn quả)
								</option>
								<option value="grow_method">
									Phương pháp trồng (thủy canh, trồng đất)
								</option>
								<option value="accessory">Phụ kiện (dụng cụ, chậu cây)</option>
								<option value="purpose">
									Mục đích (trang trí, phong thủy)
								</option>
							</select>
						)}
					/>
					{errors.type && (
						<p className="text-red-500 text-sm">{errors.type.message}</p>
					)}
				</div>

				{/* Danh mục cha */}
				<div className="space-y-1">
					<label className="block font-medium text-gray-700">
						Danh mục cha
					</label>
					<Controller
						name="parent"
						control={control}
						render={({ field }) => (
							<select
								{...field}
								value={field.value || ""}
								onChange={field.onChange}
								className={`w-full px-4 py-2 border ${
									errors.parent ? "border-red-500" : "border-gray-300"
								} rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500`}
							>
								<option value="">Không có danh mục cha</option>
								{parentCategories.map((parent) => (
									<option key={parent._id} value={parent._id}>
										{parent.name} ({parent.type})
									</option>
								))}
							</select>
						)}
					/>
					{errors.parent && (
						<p className="text-red-500 text-sm">{errors.parent.message}</p>
					)}
				</div>

				{/* Mô tả */}
				<div className="space-y-1">
					<label className="block font-medium text-gray-700">Mô tả</label>
					<Controller
						name="description"
						control={control}
						render={({ field }) => (
							<textarea
								{...field}
								value={field.value || ""}
								onChange={field.onChange}
								className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
								placeholder="Nhập mô tả danh mục"
								rows={4}
							/>
						)}
					/>
				</div>

				{/* Thumbnail */}
				<div className="space-y-1 grid grid-cols-1 md:grid-cols-2 gap-4">
					<div>
						<label className="block font-medium text-gray-700">
							Hình ảnh đại diện
						</label>
						<ImageComponent
							setImagePublicIds={handleImageUploaded}
							onUploaded={() =>
								toast.info("Ảnh đã được tải lên, nhấn Lưu để xác nhận")
							}
							maxFiles={1}
							category="product-category"
						/>
					</div>
					{watch("thumbnail") && (
						<div className="mt-2 relative w-64">
							<img
								src={watch("thumbnail")}
								alt="Hình ảnh danh mục"
								className="w-full h-40 object-cover rounded"
							/>
							<button
								type="button"
								onClick={handleRemoveThumbnail}
								className="absolute top-1 right-1 bg-red-500 text-white px-2 py-1 text-xs rounded"
							>
								Xóa
							</button>
						</div>
					)}
				</div>

				{/* Nút Lưu và Hủy */}
				<div className="flex gap-3">
					<button
						type="submit"
						className="flex items-center gap-2 px-4 py-2 text-white bg-blue-600 hover:bg-blue-700 rounded-md"
					>
						<Save size={18} /> Lưu
					</button>
					<button
						type="button"
						onClick={handleCancel}
						className="flex items-center gap-2 px-4 py-2 text-gray-600 border border-gray-300 rounded-md hover:bg-gray-100"
					>
						<X size={18} /> Hủy
					</button>
				</div>
			</form>
		</div>
	);
}
