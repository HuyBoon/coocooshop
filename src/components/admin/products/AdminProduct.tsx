"use client";

import React, { useState, useEffect } from "react";
import { useForm, Controller } from "react-hook-form";
import { toast } from "sonner";
import { Save, X } from "lucide-react";
import ImageComponent from "../ImageComponent";
import TinyMCEEditor from "../TextEditor";
import { generateSlug } from "@/libs/generateSlug";

interface Product {
	_id?: string;
	name: string;
	slug: string;
	description?: string;
	price: number;
	discountPrice?: number;
	stock: number;
	thumbnail: { url: string; public_id: string } | null;
	images: { url: string; public_id: string }[];
	categories: string[];
	tags: string[];
	attributes?: {
		height?: string;
		careLevel?: "easy" | "medium" | "hard";
		lightRequirement?: "low" | "medium" | "high";
		petFriendly?: boolean;
	};
	details: string;
}

interface Category {
	_id: string;
	name: string;
}

interface FormData {
	name: string;
	slug: string;
	description: string;
	price: string;
	discountPrice: string;
	stock: string;
	thumbnail: string;
	images: string[];
	categories: string[];
	tags: string;
	attributes: {
		height: string;
		careLevel: "easy" | "medium" | "hard" | "";
		lightRequirement: "low" | "medium" | "high" | "";
		petFriendly: boolean;
	};
	details: string;
}

interface AdminProductProps {
	product?: Product;
}

export default function AdminProduct({ product }: AdminProductProps) {
	const [hasEditedSlug, setHasEditedSlug] = useState(false);
	const [thumbnailPublicId, setThumbnailPublicId] = useState<string | null>(
		null
	);
	const [imagePublicIds, setImagePublicIds] = useState<string[]>([]);
	const [categories, setCategories] = useState<Category[]>([]);

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
			price: "",
			discountPrice: "",
			stock: "",
			thumbnail: "",
			images: [],
			categories: [],
			tags: "",
			attributes: {
				height: "",
				careLevel: "",
				lightRequirement: "",
				petFriendly: false,
			},
			details: "",
		},
	});

	const name = watch("name");
	const thumbnail = watch("thumbnail");

	// Fetch categories
	useEffect(() => {
		const fetchCategories = async () => {
			try {
				const res = await fetch(
					`${process.env.NEXT_PUBLIC_API_URL}/api/admincategory`,
					{ cache: "no-store" }
				);
				const data = await res.json();
				if (data.success) {
					setCategories(data.categories || []);
				} else {
					throw new Error(data.error || "Không thể tải danh mục");
				}
			} catch (error) {
				toast.error("Không thể tải danh mục");
			}
		};
		fetchCategories();
	}, []);

	// Auto-generate slug
	useEffect(() => {
		if (name && !hasEditedSlug) {
			setValue("slug", generateSlug(name));
		}
	}, [name, setValue, hasEditedSlug]);

	// Initialize form with product data
	useEffect(() => {
		if (product) {
			const validCategories =
				product.categories?.filter((id) =>
					categories.some((cat) => cat._id === id)
				) || [];
			reset({
				name: product.name || "",
				slug: product.slug || "",
				description: product.description || "",
				price: product.price ? product.price.toString() : "",
				discountPrice: product.discountPrice
					? product.discountPrice.toString()
					: "",
				stock: product.stock ? product.stock.toString() : "",
				thumbnail: product.thumbnail?.url || "",
				images: product.images?.map((img) => img.url) || [],
				categories: validCategories,
				tags: product.tags?.join(", ") || "",
				attributes: {
					height: product.attributes?.height || "",
					careLevel: product.attributes?.careLevel || "",
					lightRequirement: product.attributes?.lightRequirement || "",
					petFriendly: product.attributes?.petFriendly || false,
				},
				details: product.details || "",
			});
			setHasEditedSlug(!!product.slug);
			setThumbnailPublicId(product.thumbnail?.public_id || null);
			setImagePublicIds(product.images?.map((img) => img.public_id) || []);
		}
	}, [product, categories, reset]);

	// Handle thumbnail upload
	const handleThumbnailUploaded = (
		images: { url: string; publicId: string }[]
	) => {
		if (images.length > 0) {
			setValue("thumbnail", images[0].url);
			setThumbnailPublicId(images[0].publicId);
		}
	};

	// Handle images upload
	const handleImagesUploaded = (
		images: { url: string; publicId: string }[]
	) => {
		setValue(
			"images",
			images.map((img) => img.url)
		);
		setImagePublicIds(images.map((img) => img.publicId));
	};

	// Handle thumbnail removal
	const handleRemoveThumbnail = async () => {
		if (!thumbnailPublicId || !thumbnail) {
			setValue("thumbnail", "");
			setThumbnailPublicId(null);
			return;
		}
		try {
			const res = await fetch(
				`${process.env.NEXT_PUBLIC_API_URL}/api/deleteImages`,
				{
					method: "POST",
					headers: { "Content-Type": "application/json" },
					body: JSON.stringify({ publicIds: [thumbnailPublicId] }),
				}
			);
			const result = await res.json();
			if (!res.ok || !result.success) {
				throw new Error(result.message || "Xóa ảnh thumbnail thất bại");
			}
			setValue("thumbnail", "");
			setThumbnailPublicId(null);
			toast.success("Đã xóa ảnh thumbnail");
		} catch (error: any) {
			toast.error(error.message || "Xóa ảnh thumbnail thất bại");
		}
	};

	// Handle image removal
	const handleRemoveImage = async (publicId: string, index: number) => {
		try {
			const res = await fetch(
				`${process.env.NEXT_PUBLIC_API_URL}/api/deleteImages`,
				{
					method: "POST",
					headers: { "Content-Type": "application/json" },
					body: JSON.stringify({ publicIds: [publicId] }),
				}
			);
			const result = await res.json();
			if (!res.ok || !result.success) {
				throw new Error(result.message || "Xóa ảnh thất bại");
			}
			setValue(
				"images",
				watch("images").filter((_, i) => i !== index)
			);
			setImagePublicIds((prev) => prev.filter((id) => id !== publicId));
			toast.success("Đã xóa ảnh");
		} catch (error: any) {
			toast.error(error.message || "Xóa ảnh thất bại");
		}
	};

	// Handle TinyMCE image upload
	const onImageUploaded = (images: { url: string; publicId: string }[]) => {
		setImagePublicIds((prev) => [
			...prev,
			...images.map((img) => img.publicId),
		]);
	};

	// Handle cancel
	const handleCancel = async () => {
		if (
			(thumbnailPublicId && thumbnailPublicId !== "initial") ||
			imagePublicIds.length > 0
		) {
			const publicIds = [
				...(thumbnailPublicId && thumbnailPublicId !== "initial"
					? [thumbnailPublicId]
					: []),
				...imagePublicIds,
			];
			await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/deleteImages`, {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({ publicIds }),
			});
		}
		reset();
		window.location.href = "/admin/manageproducts/products";
	};

	// Handle submit
	const onSubmit = async (data: FormData) => {
		try {
			const productData = {
				name: data.name.trim() || undefined,
				slug: data.slug,
				description: data.description.trim() || undefined,
				price: data.price ? parseFloat(data.price) : 0,
				discountPrice: data.discountPrice
					? parseFloat(data.discountPrice)
					: undefined,
				stock: data.stock ? parseInt(data.stock) : 0,
				thumbnail: data.thumbnail
					? { url: data.thumbnail, public_id: thumbnailPublicId || "" }
					: null,
				images: data.images.map((url, i) => ({
					url,
					public_id: imagePublicIds[i] || "",
				})),
				categories: data.categories,
				tags: data.tags
					? data.tags
							.split(",")
							.map((t) => t.trim())
							.filter(Boolean)
					: [],
				attributes: {
					height: data.attributes.height || undefined,
					careLevel: data.attributes.careLevel || undefined,
					lightRequirement: data.attributes.lightRequirement || undefined,
					petFriendly: data.attributes.petFriendly,
				},
				details: data.details.trim() || undefined,
			};

			const method = product ? "PUT" : "POST";
			const url = product
				? `${process.env.NEXT_PUBLIC_API_URL}/api/adminproducts/${product._id}`
				: `${process.env.NEXT_PUBLIC_API_URL}/api/adminproducts`;

			const res = await fetch(url, {
				method,
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify(productData),
			});

			if (!res.ok) {
				const errorData = await res.json();
				throw new Error(errorData.error || "Không thể lưu sản phẩm");
			}

			toast.success(
				product ? "Sản phẩm đã được cập nhật" : "Sản phẩm đã được tạo"
			);
			window.location.href = "/admin/manageproducts/products";
		} catch (error: any) {
			toast.error(error.message || "Không thể lưu sản phẩm");
		}
	};

	return (
		<div className="shadow-xl text-sm p-4 mx-auto bg-white rounded-lg">
			<form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
				{/* Name */}
				<div className="space-y-1">
					<label className="block font-medium text-gray-700">
						Tên sản phẩm
					</label>
					<Controller
						name="name"
						control={control}
						rules={{ required: "Tên sản phẩm là bắt buộc" }}
						render={({ field }) => (
							<input
								{...field}
								value={field.value || ""}
								onChange={field.onChange}
								className={`w-full px-4 py-2 border ${
									errors.name ? "border-red-500" : "border-gray-300"
								} rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500`}
								placeholder="Nhập tên sản phẩm"
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
						rules={{
							required: "Slug là bắt buộc",
							pattern: {
								value: /^[a-z0-9-]+$/,
								message: "Slug chỉ chứa chữ thường, số và dấu gạch ngang",
							},
						}}
						render={({ field }) => (
							<input type="hidden" {...field} value={field.value || ""} />
						)}
					/>
				</div>

				{/* Description */}
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
								className={`w-full px-4 py-2 border ${
									errors.description ? "border-red-500" : "border-gray-300"
								} rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500`}
								placeholder="Nhập mô tả sản phẩm"
								rows={4}
							/>
						)}
					/>
					{errors.description && (
						<p className="text-red-500 text-sm">{errors.description.message}</p>
					)}
				</div>

				{/* Price */}
				<div className="space-y-1">
					<label className="block font-medium text-gray-700">Giá (USD)</label>
					<Controller
						name="price"
						control={control}
						rules={{ required: "Giá sản phẩm là bắt buộc" }}
						render={({ field }) => (
							<input
								{...field}
								type="number"
								step="0.01"
								value={field.value || ""}
								onChange={field.onChange}
								className={`w-full px-4 py-2 border ${
									errors.price ? "border-red-500" : "border-gray-300"
								} rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500`}
								placeholder="Nhập giá sản phẩm"
							/>
						)}
					/>
					{errors.price && (
						<p className="text-red-500 text-sm">{errors.price.message}</p>
					)}
				</div>

				{/* Discount Price */}
				<div className="space-y-1">
					<label className="block font-medium text-gray-700">
						Giá khuyến mãi (USD)
					</label>
					<Controller
						name="discountPrice"
						control={control}
						render={({ field }) => (
							<input
								{...field}
								type="number"
								step="0.01"
								value={field.value || ""}
								onChange={field.onChange}
								className={`w-full px-4 py-2 border ${
									errors.discountPrice ? "border-red-500" : "border-gray-300"
								} rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500`}
								placeholder="Nhập giá khuyến mãi (nếu có)"
							/>
						)}
					/>
					{errors.discountPrice && (
						<p className="text-red-500 text-sm">
							{errors.discountPrice.message}
						</p>
					)}
				</div>

				{/* Stock */}
				<div className="space-y-1">
					<label className="block font-medium text-gray-700">Tồn kho</label>
					<Controller
						name="stock"
						control={control}
						rules={{ required: "Số lượng tồn kho là bắt buộc" }}
						render={({ field }) => (
							<input
								{...field}
								type="number"
								value={field.value || ""}
								onChange={field.onChange}
								className={`w-full px-4 py-2 border ${
									errors.stock ? "border-red-500" : "border-gray-300"
								} rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500`}
								placeholder="Nhập số lượng tồn kho"
							/>
						)}
					/>
					{errors.stock && (
						<p className="text-red-500 text-sm">{errors.stock.message}</p>
					)}
				</div>

				{/* Thumbnail */}
				<div className="space-y-1 grid grid-cols-1 md:grid-cols-2 gap-4">
					<div>
						<label className="block font-medium text-gray-700">
							Hình ảnh đại diện
						</label>
						<ImageComponent
							setImagePublicIds={handleThumbnailUploaded}
							onUploaded={() =>
								toast.info(
									"Ảnh thumbnail đã được tải lên, nhấn Lưu để xác nhận"
								)
							}
							maxFiles={1}
							category="product"
						/>
					</div>
					{thumbnail && (
						<div className="mt-2 relative w-32">
							<img
								src={thumbnail}
								alt="Hình ảnh đại diện sản phẩm"
								className="w-full h-20 object-cover rounded"
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

				{/* Images */}
				<div className="space-y-1 grid grid-cols-1 md:grid-cols-2 gap-4">
					<div>
						<label className="block font-medium text-gray-700">
							Hình ảnh sản phẩm
						</label>
						<ImageComponent
							setImagePublicIds={handleImagesUploaded}
							onUploaded={() =>
								toast.info("Ảnh đã được tải lên, nhấn Lưu để xác nhận")
							}
							maxFiles={5}
							category="product"
						/>
					</div>
					{watch("images").length > 0 && (
						<div className="mt-2 grid grid-cols-2 gap-2">
							{watch("images").map((url, index) => (
								<div key={index} className="relative w-32">
									<img
										src={url}
										alt={`Hình ảnh sản phẩm ${index + 1}`}
										className="w-full h-20 object-cover rounded"
									/>
									<button
										type="button"
										onClick={() =>
											handleRemoveImage(imagePublicIds[index], index)
										}
										className="absolute top-1 right-1 bg-red-500 text-white px-2 py-1 text-xs rounded"
									>
										Xóa
									</button>
								</div>
							))}
						</div>
					)}
				</div>

				{/* Categories */}
				<div className="space-y-1">
					<label className="block font-medium text-gray-700">Danh mục</label>
					<Controller
						name="categories"
						control={control}
						rules={{
							required: "Danh mục là bắt buộc",
							validate: (value) => value.length > 0 || "Danh mục là bắt buộc",
						}}
						render={({ field }) => (
							<div
								className={`grid grid-cols-1 sm:grid-cols-2 gap-2 max-h-32 overflow-y-auto border p-2 rounded-md ${
									errors.categories ? "border-red-500" : "border-gray-300"
								}`}
							>
								{categories.map((cat) => (
									<label key={cat._id} className="flex items-center space-x-2">
										<input
											type="checkbox"
											value={cat._id}
											checked={field.value.includes(cat._id)}
											onChange={(e) => {
												const updatedCategories = e.target.checked
													? [...new Set([...field.value, cat._id])]
													: field.value.filter((id) => id !== cat._id);
												field.onChange(updatedCategories);
											}}
											className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
										/>
										<span className="text-gray-700">{cat.name}</span>
									</label>
								))}
							</div>
						)}
					/>
					{errors.categories && (
						<p className="text-red-500 text-sm">{errors.categories.message}</p>
					)}
				</div>

				{/* Tags */}
				<div className="space-y-1">
					<label className="block font-medium text-gray-700">
						Tags (phân cách bằng dấu phẩy)
					</label>
					<Controller
						name="tags"
						control={control}
						render={({ field }) => (
							<input
								{...field}
								value={field.value || ""}
								onChange={field.onChange}
								className={`w-full px-4 py-2 border ${
									errors.tags ? "border-red-500" : "border-gray-300"
								} rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500`}
								placeholder="Nhập tags, ví dụ: cây cảnh, dễ chăm sóc"
							/>
						)}
					/>
					{errors.tags && (
						<p className="text-red-500 text-sm">{errors.tags.message}</p>
					)}
				</div>

				{/* Attributes */}
				<div className="space-y-1">
					<label className="block font-medium text-gray-700">Thuộc tính</label>
					<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
						{/* Height */}
						<div>
							<label className="block text-sm text-gray-600">Chiều cao</label>
							<Controller
								name="attributes.height"
								control={control}
								render={({ field }) => (
									<input
										{...field}
										value={field.value || ""}
										onChange={field.onChange}
										className={`w-full px-4 py-2 border ${
											errors.attributes?.height
												? "border-red-500"
												: "border-gray-300"
										} rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500`}
										placeholder="Nhập chiều cao (nếu có)"
									/>
								)}
							/>
						</div>

						{/* Care Level */}
						<div>
							<label className="block text-sm text-gray-600">
								Mức độ chăm sóc
							</label>
							<Controller
								name="attributes.careLevel"
								control={control}
								render={({ field }) => (
									<select
										{...field}
										value={field.value || ""}
										onChange={field.onChange}
										className={`w-full px-4 py-2 border ${
											errors.attributes?.careLevel
												? "border-red-500"
												: "border-gray-300"
										} rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500`}
									>
										<option value="">Chọn mức độ chăm sóc</option>
										<option value="easy">Dễ</option>
										<option value="medium">Trung bình</option>
										<option value="hard">Khó</option>
									</select>
								)}
							/>
						</div>

						{/* Light Requirement */}
						<div>
							<label className="block text-sm text-gray-600">
								Yêu cầu ánh sáng
							</label>
							<Controller
								name="attributes.lightRequirement"
								control={control}
								render={({ field }) => (
									<select
										{...field}
										value={field.value || ""}
										onChange={field.onChange}
										className={`w-full px-4 py-2 border ${
											errors.attributes?.lightRequirement
												? "border-red-500"
												: "border-gray-300"
										} rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500`}
									>
										<option value="">Chọn yêu cầu ánh sáng</option>
										<option value="low">Thấp</option>
										<option value="medium">Trung bình</option>
										<option value="high">Cao</option>
									</select>
								)}
							/>
						</div>

						{/* Pet Friendly */}
						<div>
							<label className="block text-sm text-gray-600">
								Thân thiện với thú cưng
							</label>
							<Controller
								name="attributes.petFriendly"
								control={control}
								render={({ field }) => (
									<input
										type="checkbox"
										checked={field.value}
										onChange={(e) => field.onChange(e.target.checked)}
										className="h-5 w-5 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
									/>
								)}
							/>
						</div>
					</div>
				</div>

				{/* Details */}
				<div className="space-y-1">
					<label className="block font-medium text-gray-700">Chi tiết</label>
					<Controller
						name="details"
						control={control}
						rules={{ required: "Chi tiết sản phẩm là bắt buộc" }}
						render={({ field }) => (
							<TinyMCEEditor
								value={field.value || ""}
								onChange={field.onChange}
								category="product"
								onImageUploaded={(publicId, imgUrl) => {
									setImagePublicIds((prev) => [...prev, publicId]);
								}}
								height={700}
							/>
						)}
					/>
					{errors.details && (
						<p className="text-red-500 text-sm">{errors.details.message}</p>
					)}
				</div>

				{/* Buttons */}
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
