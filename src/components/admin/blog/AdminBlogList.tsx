"use client";

import React from "react";
import { Trash2, Edit } from "lucide-react";
import Link from "next/link";
import { useBlogs } from "@/hooks/useBlogs";
import Pagination from "@/components/ui/Pagination";
import Loading from "../Loading";

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

interface PaginationData {
	totalItems: number;
	totalPages: number;
	currentPage: number;
	pageSize: number;
}

interface AdminBlogListProps {
	apiUrl: string;
	initialBlogs: BlogCard[];
	initialPagination: PaginationData;
}

const AdminBlogList: React.FC<AdminBlogListProps> = ({
	apiUrl,
	initialBlogs,
	initialPagination,
}) => {
	const { blogs, pagination, loading, handleDeleteBlog, handlePageChange } =
		useBlogs(apiUrl, initialBlogs, initialPagination);

	return (
		<div className="p-4 rounded-sm shadow-sm border mt-5 bg-white">
			{loading ? (
				<Loading />
			) : blogs.length === 0 ? (
				<p className="text-center text-gray-500">Chưa có bài viết nào</p>
			) : (
				<>
					<table className="w-full border-collapse text-sm">
						<thead>
							<tr className="bg-gray-100 text-center">
								<th className="border p-2">Thumbnail</th>
								<th className="border p-2">Tiêu đề</th>
								<th className="border p-2">Danh mục</th>
								<th className="border p-2">Tác giả</th>
								<th className="border p-2">Trạng thái</th>
								<th className="border p-2">Hành động</th>
							</tr>
						</thead>
						<tbody>
							{blogs.map((blog) => (
								<tr key={blog._id} className="hover:bg-gray-50">
									<td className="border p-3">
										<img
											src={blog.thumbnail || "/placeholder-image.jpg"}
											alt={blog.title}
											className="w-24 h-12 object-cover rounded-md mx-auto"
										/>
									</td>
									<td className="border p-3">{blog.title}</td>
									<td className="border p-3">{blog.category.name}</td>
									<td className="border p-3">{blog.author}</td>
									<td className="border p-3">
										{blog.status === "published" ? "Đã đăng" : "Bản nháp"}
									</td>
									<td className="border p-3">
										<div className="flex items-center justify-center gap-2">
											<Link
												href={`/admin/manageblogs/blogs/edit/${blog._id}`}
												className="flex items-center justify-center"
											>
												<button
													type="button"
													title="Chỉnh sửa bài viết"
													className="text-blue-500 hover:text-blue-700"
												>
													<Edit size={18} />
												</button>
											</Link>
											<button
												type="button"
												title="Xóa bài viết"
												onClick={() => handleDeleteBlog(blog._id)}
												className="text-red-500 hover:text-red-700"
											>
												<Trash2 size={18} />
											</button>
										</div>
									</td>
								</tr>
							))}
						</tbody>
					</table>
					<Pagination
						currentPage={pagination.currentPage}
						totalPages={pagination.totalPages}
						onPageChange={handlePageChange}
					/>
				</>
			)}
		</div>
	);
};

export default AdminBlogList;
