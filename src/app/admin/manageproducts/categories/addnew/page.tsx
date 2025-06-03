import React from "react";
import HeaderTitle from "@/components/admin/HeaderTitle";
import AdminProductCategory from "@/components/admin/products/AdminProductCategory";

export default function AddNewProductCategory() {
	return (
		<div className="mx-auto max-w-7xl">
			<HeaderTitle
				title="Thêm danh mục sản phẩm"
				path="/admin/manageproducts/categories"
				addItem="Quay lại danh sách"
			/>
			<div className="mt-5 px-4">
				<AdminProductCategory />
			</div>
		</div>
	);
}
