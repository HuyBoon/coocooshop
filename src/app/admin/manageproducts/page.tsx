import HeaderTitle from "@/components/admin/HeaderTitle";
import React from "react";

const ProductsManagement = () => {
	return (
		<div>
			<HeaderTitle
				title="Quản lý sản phẩm"
				path="/admin/manageproducts/products/addnew"
				addItem="Thêm sản phẩm mới"
			/>
		</div>
	);
};

export default ProductsManagement;
