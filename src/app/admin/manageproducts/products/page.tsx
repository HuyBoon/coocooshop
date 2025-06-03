import HeaderTitle from "@/components/admin/HeaderTitle";
import React from "react";

const ProductManagement = () => {
	return (
		<div>
			<HeaderTitle
				title="Quản lý cây"
				path="/admin/manageproducts/products/addnew"
				addItem="Thêm sản phẩm mới"
			/>
		</div>
	);
};

export default ProductManagement;
