import HeaderTitle from "@/components/admin/HeaderTitle";
import AdminProduct from "@/components/admin/products/AdminProduct";
import React from "react";

const AddNewProduct = () => {
	return (
		<div>
			<HeaderTitle
				title="Thêm mới sản phẩm"
				path="/admin/manageproducts/products"
				addItem="Quay lại"
			/>
			<div className="mt-5 px-4">
				<AdminProduct />
			</div>
		</div>
	);
};

export default AddNewProduct;
