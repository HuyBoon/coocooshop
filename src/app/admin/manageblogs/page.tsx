import HeaderTitle from "@/components/admin/HeaderTitle";
import React from "react";

const AdminBlogs = () => {
	return (
		<div>
			<HeaderTitle
				title="Quản lý blogs"
				path="/admin/manageblogs/products/addnew"
				addItem="Thêm bài viết"
			/>
		</div>
	);
};

export default AdminBlogs;
