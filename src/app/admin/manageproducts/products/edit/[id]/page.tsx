import HeaderTitle from "@/components/admin/HeaderTitle";
import AdminProduct from "@/components/admin/products/AdminProduct";
import React from "react";

interface ProductData {
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

async function fetchProduct(id: string): Promise<ProductData | null> {
	try {
		const res = await fetch(
			`${process.env.NEXT_PUBLIC_API_URL}/api/adminproducts/${id}`,
			{ cache: "no-store" }
		);
		if (!res.ok) {
			console.error(`Failed to fetch product: ${res.statusText}`);
			return null;
		}
		const data = await res.json();
		if (!data.success || !data.product) {
			console.error("Invalid response data");
			return null;
		}

		// Convert ObjectIds to strings and ensure serializable data
		return {
			_id: data.product._id ? String(data.product._id) : "",
			name: data.product.name ?? "",
			slug: data.product.slug ?? "",
			description: data.product.description ?? "",
			price: data.product.price ?? 0,
			discountPrice: data.product.discountPrice ?? undefined,
			stock: data.product.stock ?? 0,
			thumbnail: data.product.thumbnail
				? {
						url: data.product.thumbnail.url ?? "",
						public_id: data.product.thumbnail.public_id ?? "",
				  }
				: null,
			images: Array.isArray(data.product.images)
				? data.product.images.map((img: any) => ({
						url: img.url ?? "",
						public_id: img.public_id ?? "",
				  }))
				: [],
			categories: Array.isArray(data.product.categories)
				? data.product.categories.map((id: any) => String(id))
				: [],
			tags: Array.isArray(data.product.tags) ? data.product.tags : [],
			attributes: {
				height: data.product.attributes?.height ?? "",
				careLevel: data.product.attributes?.careLevel ?? "",
				lightRequirement: data.product.attributes?.lightRequirement ?? "",
				petFriendly: data.product.attributes?.petFriendly ?? false,
			},
			details: data.product.details ?? "",
		};
	} catch (error) {
		console.error("Server fetchProduct error:", error);
		return null;
	}
}

export default async function EditProductPage(context: {
	params: Promise<{ id: string }>;
}) {
	const { id } = await context.params;

	const product = await fetchProduct(id);

	if (!product) {
		return (
			<div className="mx-auto px-4">
				<HeaderTitle
					title="Chỉnh sửa sản phẩm"
					path="/admin/manageproducts/products"
					addItem="Quay lại danh sách sản phẩm"
				/>
				<p className="text-center text-red-500">
					Sản phẩm không tồn tại hoặc lỗi khi tải dữ liệu
				</p>
			</div>
		);
	}

	return (
		<div className="mx-auto">
			<HeaderTitle
				title="Chỉnh sửa sản phẩm"
				path="/admin/manageproducts/products"
				addItem="Quay lại danh sách sản phẩm"
			/>
			<div className="mt-5 mx-auto px-4">
				<AdminProduct product={product} />
			</div>
		</div>
	);
}
