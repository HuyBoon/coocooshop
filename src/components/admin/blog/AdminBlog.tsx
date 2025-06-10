"use client";

import React, { useState, useEffect } from "react";
import { useForm, Controller } from "react-hook-form";
import { toast } from "sonner";
import { Save, X } from "lucide-react";
import ImageComponent from "../ImageComponent";
import TinyMCEEditor from "../TextEditor";
import { generateSlug } from "@/libs/generateSlug";

interface Blog {
	_id?: string;
	title: string;
	slug: string;
	content: string;
	thumbnail: string;
	category: string;
	tags: string[];
	author: string;
	publishedDate?: Date;
	timeRead: string;
	status: "draft" | "published";
	metaDescription: string;
}

interface Category {
	_id: string;
	name: string;
}

interface FormData {
	title: string;
	slug: string;
	content: string;
	thumbnail: string;
	category: string;
	tags: string;
	author: string;
	publishedDate: string;
	timeRead: string;
	status: "draft" | "published";
	metaDescription: string;
}

interface AdminBlogProps {
	blog?: Blog;
}

export default function AdminBlog({ blog }: AdminBlogProps) {
	const [hasEditedSlug, setHasEditedSlug] = useState(false);
	const [thumbnailPublicId, setThumbnailPublicId] = useState<string | null>(
		null
	);
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
			title: "",
			slug: "",
			content: "",
			thumbnail: "",
			category: "",
			tags: "",
			author: "",
			publishedDate: "",
			timeRead: "",
			status: "draft",
			metaDescription: "",
		},
	});

	const title = watch("title");
	const thumbnail = watch("thumbnail");

	// Fetch categories
	useEffect(() => {
		const fetchCategories = async () => {
			try {
				const res = await fetch(
					`${process.env.NEXT_PUBLIC_API_URL}/api/adminblogcategory`,
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
		if (title && !hasEditedSlug) {
			setValue("slug", generateSlug(title));
		}
	}, [title, setValue, hasEditedSlug]);

	// Initialize form with blog data
	useEffect(() => {
		if (blog) {
			reset({
				title: blog.title || "",
				slug: blog.slug || "",
				content: blog.content || "",
				thumbnail: blog.thumbnail || "",
				category: blog.category || "",
				tags: blog.tags?.join(", ") || "",
				author: blog.author || "",
				publishedDate: blog.publishedDate
					? new Date(blog.publishedDate).toISOString().split("T")[0]
					: "",
				timeRead: blog.timeRead || "",
				status: blog.status || "draft",
				metaDescription: blog.metaDescription || "",
			});
			setHasEditedSlug(!!blog.slug);
			setThumbnailPublicId(blog.thumbnail ? "initial" : null);
		}
	}, [blog, reset]);

	// Handle thumbnail upload
	const handleThumbnailUploaded = (
		images: { url: string; publicId: string }[]
	) => {
		if (images.length > 0) {
			setValue("thumbnail", images[0].url);
			setThumbnailPublicId(images[0].publicId);
		}
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
				`${process.env.NEXT_PUBLIC_API_URL}/api/admin/deleteImages`,
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

	// Handle TinyMCE image upload
	const onImageUploaded = (images: { url: string; publicId: string }[]) => {
		setThumbnailPublicId((prev) => images[0]?.publicId || prev);
	};

	// Handle cancel
	const handleCancel = async () => {
		if (thumbnailPublicId && thumbnailPublicId !== "initial") {
			await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/admin/deleteImages`, {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({ publicIds: [thumbnailPublicId] }),
			});
		}
		reset();
		window.location.href = "/admin/manageblogs/blogs";
	};

	// Handle submit
	const onSubmit = async (data: FormData) => {
		try {
			const blogData = {
				title: data.title.trim() || undefined,
				slug: data.slug,
				content: data.content.trim() || undefined,
				thumbnail: data.thumbnail
					? { url: data.thumbnail, public_id: thumbnailPublicId || "" }
					: "",
				category: data.category || undefined,
				tags: data.tags
					? data.tags
							.split(",")
							.map((t) => t.trim())
							.filter(Boolean)
					: [],
				author: data.author.trim() || undefined,
				publishedDate: data.publishedDate
					? new Date(data.publishedDate)
					: undefined,
				timeRead: data.timeRead.trim() || undefined,
				status: data.status,
				metaDescription: data.metaDescription.trim() || undefined,
			};

			const method = blog ? "PUT" : "POST";
			const url = blog
				? `${process.env.NEXT_PUBLIC_API_URL}/api/adminblogs/${blog._id}`
				: `${process.env.NEXT_PUBLIC_API_URL}/api/adminblogs`;

			const res = await fetch(url, {
				method,
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify(blogData),
			});

			if (!res.ok) {
				const errorData = await res.json();
				throw new Error(errorData.error || "Không thể lưu bài viết");
			}

			toast.success(
				blog ? "Bài viết đã được cập nhật" : "Bài viết đã được tạo"
			);
			window.location.href = "/admin/manageblogs/blogs";
		} catch (error: any) {
			toast.error(error.message || "Không thể lưu bài viết");
		}
	};

	return (
		<div className="shadow-xl text-sm p-4 mx-auto bg-white rounded-lg">
			<form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
				{/* Title */}
				<div className="space-y-1">
					<label className="block font-medium text-gray-700">Tiêu đề</label>
					<Controller
						name="title"
						control={control}
						rules={{ required: "Tiêu đề là bắt buộc" }}
						render={({ field }) => (
							<input
								{...field}
								value={field.value || ""}
								onChange={(e) => {
									field.onChange(e);
									if (!hasEditedSlug)
										setValue("slug", generateSlug(e.target.value));
								}}
								className={`w-full px-4 py-2 border ${
									errors.title ? "border-red-500" : "border-gray-300"
								} rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500`}
								placeholder="Nhập tiêu đề bài viết"
							/>
						)}
					/>
					{errors.title && (
						<p className="text-red-500 text-sm">{errors.title.message}</p>
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
							<input
								type="hidden"
								{...field}
								value={field.value || ""}
								onChange={(e) => {
									field.onChange(e);
									setHasEditedSlug(true);
								}}
							/>
						)}
					/>
				</div>

				{/* Content */}
				<div className="space-y-1">
					<label className="block font-medium text-gray-700">Nội dung</label>
					<Controller
						name="content"
						control={control}
						rules={{ required: "Nội dung bài viết là bắt buộc" }}
						render={({ field }) => (
							<TinyMCEEditor
								value={field.value || ""}
								onChange={field.onChange}
								category="blog"
								onImageUploaded={(publicId, imgUrl) => {
									onImageUploaded([{ url: imgUrl, publicId }]);
								}}
								height={700}
							/>
						)}
					/>
					{errors.content && (
						<p className="text-red-500 text-sm">{errors.content.message}</p>
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
							category="blog"
						/>
					</div>
					{thumbnail && (
						<div className="mt-2 relative w-32">
							<img
								src={thumbnail}
								alt="Hình ảnh đại diện bài viết"
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

				{/* Category */}
				<div className="space-y-1">
					<label className="block font-medium text-gray-700">Danh mục</label>
					<Controller
						name="category"
						control={control}
						rules={{ required: "Danh mục là bắt buộc" }}
						render={({ field }) => (
							<select
								{...field}
								value={field.value || ""}
								onChange={field.onChange}
								className={`w-full px-4 py-2 border ${
									errors.category ? "border-red-500" : "border-gray-300"
								} rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500`}
							>
								<option value="">Chọn danh mục</option>
								{categories.map((cat) => (
									<option key={cat._id} value={cat._id}>
										{cat.name}
									</option>
								))}
							</select>
						)}
					/>
					{errors.category && (
						<p className="text-red-500 text-sm">{errors.category.message}</p>
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
								placeholder="Nhập tags, ví dụ: blog, tin tức, hướng dẫn"
							/>
						)}
					/>
					{errors.tags && (
						<p className="text-red-500 text-sm">{errors.tags.message}</p>
					)}
				</div>

				{/* Author */}
				<div className="space-y-1">
					<label className="block font-medium text-gray-700">Tác giả</label>
					<Controller
						name="author"
						control={control}
						rules={{ required: "Tác giả là bắt buộc" }}
						render={({ field }) => (
							<input
								{...field}
								value={field.value || ""}
								onChange={field.onChange}
								className={`w-full px-4 py-2 border ${
									errors.author ? "border-red-500" : "border-gray-300"
								} rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500`}
								placeholder="Nhập tên tác giả"
							/>
						)}
					/>
					{errors.author && (
						<p className="text-red-500 text-sm">{errors.author.message}</p>
					)}
				</div>

				{/* Published Date */}
				<div className="space-y-1">
					<label className="block font-medium text-gray-700">Ngày đăng</label>
					<Controller
						name="publishedDate"
						control={control}
						render={({ field }) => (
							<input
								{...field}
								type="date"
								value={field.value || ""}
								onChange={field.onChange}
								className={`w-full px-4 py-2 border ${
									errors.publishedDate ? "border-red-500" : "border-gray-300"
								} rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500`}
							/>
						)}
					/>
					{errors.publishedDate && (
						<p className="text-red-500 text-sm">
							{errors.publishedDate.message}
						</p>
					)}
				</div>

				{/* Time Read */}
				<div className="space-y-1">
					<label className="block font-medium text-gray-700">
						Thời gian đọc (phút)
					</label>
					<Controller
						name="timeRead"
						control={control}
						render={({ field }) => (
							<input
								{...field}
								value={field.value || ""}
								onChange={field.onChange}
								className={`w-full px-4 py-2 border ${
									errors.timeRead ? "border-red-500" : "border-gray-300"
								} rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500`}
								placeholder="Nhập thời gian đọc, ví dụ: 5 phút"
							/>
						)}
					/>
					{errors.timeRead && (
						<p className="text-red-500 text-sm">{errors.timeRead.message}</p>
					)}
				</div>

				{/* Status */}
				<div className="space-y-1">
					<label className="block font-medium text-gray-700">Trạng thái</label>
					<Controller
						name="status"
						control={control}
						rules={{ required: "Trạng thái là bắt buộc" }}
						render={({ field }) => (
							<select
								{...field}
								value={field.value || ""}
								onChange={field.onChange}
								className={`w-full px-4 py-2 border ${
									errors.status ? "border-red-500" : "border-gray-300"
								} rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500`}
							>
								<option value="draft">Bản nháp</option>
								<option value="published">Đã đăng</option>
							</select>
						)}
					/>
					{errors.status && (
						<p className="text-red-500 text-sm">{errors.status.message}</p>
					)}
				</div>

				{/* Meta Description */}
				<div className="space-y-1">
					<label className="block font-medium text-gray-700">
						Meta Description
					</label>
					<Controller
						name="metaDescription"
						control={control}
						render={({ field }) => (
							<textarea
								{...field}
								value={field.value || ""}
								onChange={field.onChange}
								className={`w-full px-4 py-2 border ${
									errors.metaDescription ? "border-red-500" : "border-gray-300"
								} rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500`}
								placeholder="Nhập meta description cho SEO"
								rows={4}
							/>
						)}
					/>
					{errors.metaDescription && (
						<p className="text-red-500 text-sm">
							{errors.metaDescription.message}
						</p>
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
