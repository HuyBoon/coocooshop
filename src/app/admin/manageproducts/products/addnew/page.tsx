import HeaderTitle from "@/components/admin/HeaderTitle";
import React from "react";

const AddNewProduct = () => {
	return (
		<div>
			<HeaderTitle
				title="Thêm mới sản phẩm"
				path="/admin/manageproducts/products"
				addItem="Quay lại"
			/>
		</div>
	);
};

export default AddNewProduct;
