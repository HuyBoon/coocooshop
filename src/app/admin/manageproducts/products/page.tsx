import React from "react";
import { dbConnect } from "@/libs/dbConnect";
import HeaderTitle from "@/components/admin/HeaderTitle";
import AdminProductList from "@/components/admin/products/AdminProductList";
import { Product } from "@/models/Product";
import "@/models/ProductCategory";

interface ProductCard {
	_id: string;
	name: string;
	slug: string;
	price: number;
	discountPrice?: number;
	stock: number;
	thumbnail: { url: string; public_id: string } | null;
	categories: { _id: string; name: string }[];
	details: string;
}

interface Pagination {
	totalItems: number;
	totalPages: number;
	currentPage: number;
	pageSize: number;
}

async function fetchProducts(
	page: number = 1,
	limit: number = 10
): Promise<{ products: ProductCard[]; pagination: Pagination }> {
	try {
		await dbConnect();
		const totalItems = await Product.countDocuments();
		const totalPages = Math.ceil(totalItems / limit);
		const productsRaw = await Product.find()
			.skip((page - 1) * limit)
			.limit(limit)
			.populate("categories", "name")
			.lean()
			.select(
				"-__v -description -images -tags -attributes -createdAt -updatedAt"
			);

		const products: ProductCard[] = productsRaw.map((prod: any) => ({
			_id: prod._id?.toString() ?? "",
			name: prod.name ?? "",
			slug: prod.slug ?? "",
			price: prod.price ?? 0,
			discountPrice: prod.discountPrice ?? undefined,
			stock: prod.stock ?? 0,
			thumbnail: prod.thumbnail ?? { url: "", public_id: "" },
			categories:
				prod.categories?.map((cat: any) => ({
					_id: cat._id?.toString() ?? "",
					name: cat.name ?? "",
				})) ?? [],
			details: prod.details ?? "",
		}));

		return {
			products,
			pagination: {
				totalItems,
				totalPages,
				currentPage: page,
				pageSize: limit,
			},
		};
	} catch (error) {
		console.error("Server fetchProducts error:", error);
		return {
			products: [],
			pagination: {
				totalItems: 0,
				totalPages: 1,
				currentPage: page,
				pageSize: limit,
			},
		};
	}
}

export default async function ProductsPage() {
	const apiUrl = process.env.NEXT_PUBLIC_API_URL || "";
	const initialProductsData = await fetchProducts(1, 10);

	return (
		<div className="mx-auto">
			<HeaderTitle
				title="Danh sách sản phẩm"
				path="/admin/manageproducts/products/addnew"
				addItem="Thêm sản phẩm mới"
			/>
			<div className="mx-auto px-4">
				<AdminProductList
					apiUrl={apiUrl}
					initialProducts={initialProductsData.products}
					initialPagination={initialProductsData.pagination}
				/>
			</div>
		</div>
	);
}
