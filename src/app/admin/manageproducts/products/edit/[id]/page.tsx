import HeaderTitle from "@/components/admin/HeaderTitle";
import React from "react";

const EditProduct = () => {
	return (
		<div>
			<HeaderTitle
				title="Chỉnh sửa sản phẩm"
				path="/admin/manageproducts/products"
				addItem="Quay lại"
			/>
		</div>
	);
};

export default EditProduct;
