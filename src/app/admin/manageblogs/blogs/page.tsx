import React from "react";
import { dbConnect } from "@/libs/dbConnect";
import HeaderTitle from "@/components/admin/HeaderTitle";
import AdminBlogList from "@/components/admin/blog/AdminBlogList";
import { Blog } from "@/models/Blog";
import "@/models/BlogCategory";

interface BlogCard {
	_id: string;
	title: string;
	slug: string;
	thumbnail: string;
	category: { _id: string; name: string };
	author: string;
	publishedDate?: Date;
	status: "draft" | "published";
	metaDescription: string;
}

interface Pagination {
	totalItems: number;
	totalPages: number;
	currentPage: number;
	pageSize: number;
}

async function fetchBlogs(
	page: number = 1,
	limit: number = 10
): Promise<{ blogs: BlogCard[]; pagination: Pagination }> {
	try {
		await dbConnect();
		const totalItems = await Blog.countDocuments();
		const totalPages = Math.ceil(totalItems / limit);
		const blogsRaw = await Blog.find()
			.skip((page - 1) * limit)
			.limit(limit)
			.populate("category", "name")
			.lean()
			.select("-__v -content -tags -timeRead -createdAt -updatedAt");

		const blogs: BlogCard[] = blogsRaw.map((blog: any) => ({
			_id: blog._id?.toString() ?? "",
			title: blog.title ?? "",
			slug: blog.slug ?? "",
			thumbnail: blog.thumbnail ?? "",
			category: {
				_id: blog.category?._id?.toString() ?? "",
				name: blog.category?.name ?? "",
			},
			author: blog.author ?? "",
			publishedDate: blog.publishedDate,
			status: blog.status ?? "draft",
			metaDescription: blog.metaDescription ?? "",
		}));

		return {
			blogs,
			pagination: {
				totalItems,
				totalPages,
				currentPage: page,
				pageSize: limit,
			},
		};
	} catch (error) {
		console.error("Server fetchBlogs error:", error);
		return {
			blogs: [],
			pagination: {
				totalItems: 0,
				totalPages: 1,
				currentPage: page,
				pageSize: limit,
			},
		};
	}
}

export default async function BlogsPage() {
	const apiUrl = process.env.NEXT_PUBLIC_API_URL || "";
	const initialBlogsData = await fetchBlogs(1, 10);

	return (
		<div className="mx-auto">
			<HeaderTitle
				title="Danh sách bài viết"
				path="/admin/manageblogs/blogs/addnew"
				addItem="Thêm bài viết mới"
			/>
			<div className="mx-auto px-4">
				<AdminBlogList
					apiUrl={apiUrl}
					initialBlogs={initialBlogsData.blogs}
					initialPagination={initialBlogsData.pagination}
				/>
			</div>
		</div>
	);
}
