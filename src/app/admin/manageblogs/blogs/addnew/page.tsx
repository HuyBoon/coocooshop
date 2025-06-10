import React from "react";
import HeaderTitle from "@/components/admin/HeaderTitle";
import AdminBlog from "@/components/admin/blog/AdminBlog";

const AddNewBlog = () => {
	return (
		<div>
			<HeaderTitle
				title="Thêm mới bài viết"
				path="/admin/manageblogs/blogs"
				addItem="Quay lại"
			/>
			<div className="mt-5 px-4">
				<AdminBlog />
			</div>
		</div>
	);
};

export default AddNewBlog;
