import React from "react";
import { dbConnect } from "@/libs/dbConnect";
import { BlogCategory } from "@/models/BlogCategory";
import HeaderTitle from "@/components/admin/HeaderTitle";
import BlogCategoryList from "@/components/admin/blog/BlogCategoryList";

interface CategoryCard {
	_id: string;
	name: string;
	slug: string;
	description?: string;
}

interface Pagination {
	totalItems: number;
	totalPages: number;
	currentPage: number;
	pageSize: number;
}

async function fetchBlogCategories(
	page: number = 1,
	limit: number = 6
): Promise<{ categories: CategoryCard[]; pagination: Pagination }> {
	try {
		await dbConnect();
		const totalItems = await BlogCategory.countDocuments();
		const totalPages = Math.ceil(totalItems / limit);
		const categoriesRaw = await BlogCategory.find()
			.skip((page - 1) * limit)
			.limit(limit)
			.lean()
			.select("-__v");
		const categories: CategoryCard[] = categoriesRaw.map((cat: any) => ({
			_id: cat._id.toString(),
			name: cat.name || "",
			slug: cat.slug || "",
			description: cat.description || "",
		}));

		return {
			categories,
			pagination: {
				totalItems,
				totalPages,
				currentPage: page,
				pageSize: limit,
			},
		};
	} catch (error) {
		console.error("Server fetch error:", error);
		return {
			categories: [],
			pagination: {
				totalItems: 0,
				totalPages: 1,
				currentPage: page,
				pageSize: limit,
			},
		};
	}
}

export default async function BlogCategoriesPage() {
	const apiUrl = process.env.NEXT_PUBLIC_API_URL || "";
	const initialCategoriesData = await fetchBlogCategories(1, 6);

	return (
		<div className="mx-auto">
			<HeaderTitle
				title="Danh mục bài viết"
				path="/admin/manageblogs/category/addnew"
				addItem="Thêm danh mục mới"
			/>
			<div className="mx-auto px-4">
				<BlogCategoryList
					apiUrl={apiUrl}
					initialCategories={initialCategoriesData.categories}
					initialPagination={initialCategoriesData.pagination}
				/>
			</div>
		</div>
	);
}
