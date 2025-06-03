import HeaderTitle from "@/components/admin/HeaderTitle";
import React from "react";

const EditCategory = () => {
	return (
		<div>
			<HeaderTitle
				title="Chỉnh sửa danh mục"
				path="/admin/manageproducts/categories"
				addItem="Quay lại"
			/>
		</div>
	);
};

export default EditCategory;
