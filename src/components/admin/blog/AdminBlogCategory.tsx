"use client";

import React, { useEffect } from "react";
import { useForm, Controller } from "react-hook-form";
import { toast } from "sonner";
import { Save, X } from "lucide-react";
import { generateSlug } from "@/libs/generateSlug";

interface Category {
	_id?: string;
	name: string;
	slug: string;
	description?: string;
}

interface FormData {
	name: string;
	slug: string;
	description: string;
}

interface AdminBlogCategoryProps {
	category?: Category;
}

export default function AdminBlogCategory({
	category,
}: AdminBlogCategoryProps) {
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
		},
	});

	const name = watch("name");

	// Auto-generate slug
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
				});
			} catch (error) {
				console.error("Error initializing form:", error);
				toast.error("Không thể tải dữ liệu danh mục");
			}
		}
	}, [category, reset]);

	// Handle form cancellation
	const handleCancel = () => {
		reset();
		window.location.href = "/admin/manageblogs/category";
	};

	// Handle form submission
	const onSubmit = async (data: FormData) => {
		try {
			const categoryData = {
				name: data.name.trim() || undefined,
				slug: data.slug.trim() || undefined,
				description: data.description.trim() || undefined,
			};

			const method = category ? "PUT" : "POST";
			const url = category
				? `${process.env.NEXT_PUBLIC_API_URL}/api/adminblogcategory/${category._id}`
				: `${process.env.NEXT_PUBLIC_API_URL}/api/adminblogcategory`;

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
			window.location.href = "/admin/manageblogs/category";
		} catch (error: any) {
			console.error("Category save error:", error);
			toast.error(error.message || "Không thể lưu danh mục");
		}
	};

	return (
		<div className="shadow-xl p-8 mx-auto bg-white rounded-lg">
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
