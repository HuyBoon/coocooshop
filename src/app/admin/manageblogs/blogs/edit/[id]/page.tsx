import React from "react";
import { dbConnect } from "@/libs/dbConnect";
import HeaderTitle from "@/components/admin/HeaderTitle";
import AdminBlog from "@/components/admin/blog/AdminBlog";
import { Blog } from "@/models/Blog";

interface BlogData {
	_id?: string;
	title: string;
	slug: string;
	content: string;
	thumbnail: string;
	category: string;
	tags: string[];
	author: string;
	publishedDate?: Date;
	timeRead: string;
	status: "draft" | "published";
	metaDescription: string;
}

type PopulatedCategory = {
	_id: string;
	name: string;
};

async function fetchBlog(id: string): Promise<BlogData | null> {
	try {
		await dbConnect();
		const blog = await Blog.findById(id)
			.populate("category", "name")
			.lean()
			.select("-__v -createdAt -updatedAt");

		if (!blog) {
			console.error("Blog not found");
			return null;
		}

		const category = blog.category as PopulatedCategory | undefined;

		return {
			_id: blog._id?.toString() ?? "",
			title: blog.title ?? "",
			slug: blog.slug ?? "",
			content: blog.content ?? "",
			thumbnail: blog.thumbnail ?? "",
			category: category?._id?.toString() ?? "",
			tags: Array.isArray(blog.tags) ? blog.tags : [],
			author: blog.author ?? "",
			publishedDate: blog.publishedDate,
			timeRead: blog.timeRead ?? "",
			status: blog.status ?? "draft",
			metaDescription: blog.metaDescription ?? "",
		};
	} catch (error) {
		console.error("Server fetchBlog error:", error);
		return null;
	}
}

export default async function EditBlogPage(context: {
	params: Promise<{ id: string }>;
}) {
	const { id } = await context.params;

	const blog = await fetchBlog(id);

	if (!blog) {
		return (
			<div className="mx-auto px-4">
				<HeaderTitle
					title="Chỉnh sửa bài viết"
					path="/admin/manageblogs/blogs"
					addItem="Quay lại danh sách bài viết"
				/>
				<p className="text-center text-red-500">
					Bài viết không tồn tại hoặc lỗi khi tải dữ liệu
				</p>
			</div>
		);
	}

	return (
		<div className="mx-auto">
			<HeaderTitle
				title="Chỉnh sửa bài viết"
				path="/admin/manageblogs/blogs"
				addItem="Quay lại danh sách bài viết"
			/>
			<div className="mt-5 mx-auto px-4">
				<AdminBlog blog={blog} />
			</div>
		</div>
	);
}
