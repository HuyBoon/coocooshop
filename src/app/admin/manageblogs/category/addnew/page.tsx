import React from "react";
import HeaderTitle from "@/components/admin/HeaderTitle";
import AdminBlogCategory from "@/components/admin/blog/AdminBlogCategory";

export default function AddBlogCategoryPage() {
	return (
		<div className="mx-auto max-w-7xl">
			<HeaderTitle
				title="Tạo danh mục bài viết"
				path="/admin/manageblogs/categories"
				addItem="Quay lại danh sách danh mục"
			/>
			<div className="mt-5 mx-auto px-4">
				<AdminBlogCategory />
			</div>
		</div>
	);
}
