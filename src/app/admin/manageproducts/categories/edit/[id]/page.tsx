import HeaderTitle from "@/components/admin/HeaderTitle";
import AdminProductCategory from "@/components/admin/products/AdminProductCategory";
import React from "react";

interface CategoryData {
	_id?: string;
	name: string;
	slug: string;
	description: string;
	thumbnail: { url: string; public_id: string };
	type: string;
	parent?: string;
}

async function fetchCategory(id: string): Promise<CategoryData | null> {
	try {
		const res = await fetch(
			`${process.env.NEXT_PUBLIC_API_URL}/api/admincategory/${id}`,
			{ cache: "no-store" }
		);
		if (!res.ok) {
			console.error(`Failed to fetch category: ${res.statusText}`);
			return null;
		}
		const data = await res.json();
		if (!data.success || !data.category) {
			console.error("Invalid response data");
			return null;
		}
		return {
			_id: data.category._id ?? "",
			name: data.category.name ?? "",
			slug: data.category.slug ?? "",
			description: data.category.description ?? "",
			thumbnail: data.category.thumbnail ?? { url: "", public_id: "" },
			type: data.category.type ?? "",
			parent: data.category.parent ?? undefined,
		};
	} catch (error) {
		console.error("Server fetchTemplateCategory error:", error);
		return null;
	}
}

export default async function EditCategoryPage(context: {
	params: Promise<{ id: string }>;
}) {
	const { id } = await context.params;

	const category = await fetchCategory(id);

	if (!category) {
		return (
			<div className="mx-auto px-4">
				<HeaderTitle
					title="Chỉnh sửa danh mục"
					path="/admin/manageproducts/categories"
					addItem="Quay lại danh sách danh mục"
				/>
				<p className="text-center text-red-500">
					Danh mục không tồn tại hoặc lỗi khi tải dữ liệu
				</p>
			</div>
		);
	}

	return (
		<div className="mx-auto">
			<HeaderTitle
				title="Chỉnh sửa danh mục"
				path="/admin/manageproducts/categories"
				addItem="Quay lại danh sách danh mục"
			/>
			<div className="mt-5 mx-auto px-4">
				<AdminProductCategory category={category} />
			</div>
		</div>
	);
}
