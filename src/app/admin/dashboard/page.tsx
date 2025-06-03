import HeaderTitle from "@/components/admin/HeaderTitle";
import React from "react";

const AdminDashboard = () => {
	return (
		<div>
			<HeaderTitle
				title="Admin Dashboard"
				path="/admin/manageproducts/products/addnew"
				addItem="Thêm sản phẩm mới"
			/>
		</div>
	);
};

export default AdminDashboard;
