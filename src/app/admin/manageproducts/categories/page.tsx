import React from "react";
import { dbConnect } from "@/libs/dbConnect";
import { ProductCategory } from "@/models/ProductCategory";
import HeaderTitle from "@/components/admin/HeaderTitle";
import ProductCategoryList from "@/components/admin/products/ProductCategoryList";

interface CategoryCard {
	_id: string;
	name: string;
	slug: string;
	thumbnail: { url: string; public_id: string };
	type: string;
}

interface Pagination {
	totalItems: number;
	totalPages: number;
	currentPage: number;
	pageSize: number;
}

async function fetchProductCategories(
	page: number = 1,
	limit: number = 10
): Promise<{ categories: CategoryCard[]; pagination: Pagination }> {
	try {
		await dbConnect();
		const totalItems = await ProductCategory.countDocuments();
		const totalPages = Math.ceil(totalItems / limit);
		const categoriesRaw = await ProductCategory.find()
			.skip((page - 1) * limit)
			.limit(limit)
			.lean()
			.select("-__v");

		const categories: CategoryCard[] = categoriesRaw.map((cat: any) => ({
			_id: cat._id?.toString() ?? "",
			name: cat.name ?? "",
			slug: cat.slug ?? "",
			thumbnail: cat.thumbnail ?? { url: "", public_id: "" },
			type: cat.type ?? "",
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
		console.error("Server fetchProductCategories error:", error);
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

export default async function ProductCategoryPage() {
	const apiUrl = process.env.NEXT_PUBLIC_API_URL || "";
	const initialCategoriesData = await fetchProductCategories(1, 10);

	return (
		<div className="mx-auto max-w-7xl">
			<HeaderTitle
				title="Danh mục sản phẩm"
				path="/admin/manageproducts/categories/addnew"
				addItem="Thêm danh mục mới"
			/>
			<div className="mx-auto px-4">
				<ProductCategoryList
					apiUrl={apiUrl}
					initialCategories={initialCategoriesData.categories}
					initialPagination={initialCategoriesData.pagination}
				/>
			</div>
		</div>
	);
}
