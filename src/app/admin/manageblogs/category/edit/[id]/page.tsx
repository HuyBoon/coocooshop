import React from "react";
import { dbConnect } from "@/libs/dbConnect";
import { BlogCategory } from "@/models/BlogCategory";
import HeaderTitle from "@/components/admin/HeaderTitle";
import AdminBlogCategory from "@/components/admin/blog/AdminBlogCategory";

interface CategoryBlogCategory {
	_id: string;
	name: string;
	slug: string;
	description?: string;
}

async function fetchBlogCategory(
	id: string
): Promise<CategoryBlogCategory | undefined> {
	try {
		await dbConnect();
		const categoryRaw = (await BlogCategory.findById(
			id
		).lean()) as CategoryBlogCategory | null;
		if (!categoryRaw) {
			return undefined;
		}
		return {
			_id: categoryRaw._id.toString(),
			name: categoryRaw.name || "",
			slug: categoryRaw.slug || "",
			description: categoryRaw.description || undefined,
		};
	} catch (error) {
		console.error("Server error fetching blog category:", error);
		return undefined;
	}
}

export default async function EditBlogCategoryPage(context: {
	params: Promise<{ id: string }>;
}) {
	const { id } = await context.params;
	const category = await fetchBlogCategory(id);

	if (!category) {
		return (
			<div className="mx-auto max-w-7xl">
				<HeaderTitle
					title="Chỉnh sửa danh mục"
					path="/admin/manageblogs/categories"
					addItem="Quay lại danh sách danh mục"
				/>
				<p className="text-center text-red-500">
					Danh mục không tồn tại hoặc lỗi khi tải dữ liệu
				</p>
			</div>
		);
	}

	return (
		<div className="mx-auto max-w-7xl">
			<HeaderTitle
				title="Chỉnh sửa danh mục"
				path="/admin/manageblogs/categories"
				addItem="Quay lại danh sách danh mục"
			/>
			<div className="mt-5 mx-auto px-4">
				<AdminBlogCategory category={category} />
			</div>
		</div>
	);
}
