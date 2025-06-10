"use client";

import React, { useState, useEffect } from "react";
import { toast } from "sonner";
import { Trash2, Edit } from "lucide-react";
import Link from "next/link";

interface BlogCategoryCard {
	_id: string;
	name: string;
	slug: string;
	description?: string;
	parent?: { _id: string; name: string } | null;
}

interface Pagination {
	totalItems: number;
	totalPages: number;
	currentPage: number;
	pageSize: number;
}

interface AdminBlogCategoryListProps {
	apiUrl: string;
	initialCategories: BlogCategoryCard[];
	initialPagination: Pagination;
}

export default function AdminBlogCategoryList({
	apiUrl,
	initialCategories,
	initialPagination,
}: AdminBlogCategoryListProps) {
	const [categories, setCategories] =
		useState<BlogCategoryCard[]>(initialCategories);
	const [pagination, setPagination] = useState<Pagination>(initialPagination);
	const [loading, setLoading] = useState(false);

	const fetchCategories = async (page: number) => {
		setLoading(true);
		try {
			const res = await fetch(
				`${apiUrl}/api/adminblogcategory?page=${page}&limit=${pagination.pageSize}`
			);
			const data = await res.json();
			if (data.success) {
				setCategories(data.categories);
				setPagination(data.pagination);
			} else {
				toast.error(data.error || "Failed to fetch categories");
			}
		} catch (error) {
			toast.error("Failed to fetch categories");
		} finally {
			setLoading(false);
		}
	};

	const handleDelete = async (id: string) => {
		if (!confirm("Are you sure you want to delete this category?")) return;
		try {
			const res = await fetch(`${apiUrl}/api/adminblogcategory/${id}`, {
				method: "DELETE",
			});
			const data = await res.json();
			if (data.success) {
				setCategories(categories.filter((cat) => cat._id !== id));
				toast.success("Category deleted");
			} else {
				toast.error(data.error || "Failed to delete category");
			}
		} catch (error) {
			toast.error("Failed to delete category");
		}
	};

	return (
		<div className="bg-white shadow-xl rounded-lg p-6">
			<h2 className="text-lg font-semibold mb-4">
				Danh sách danh mục bài viết
			</h2>
			{loading ? (
				<p>Loading...</p>
			) : categories.length === 0 ? (
				<p>No categories found.</p>
			) : (
				<div className="overflow-x-auto">
					<table className="min-w-full table-auto">
						<thead>
							<tr className="bg-gray-100">
								<th className="px-4 py-2 text-left">Tên</th>
								<th className="px-4 py-2 text-left">Slug</th>
								<th className="px-4 py-2 text-left">Danh mục cha</th>
								<th className="px-4 py-2 text-left">Hành động</th>
							</tr>
						</thead>
						<tbody>
							{categories.map((cat) => (
								<tr key={cat._id} className="border-b">
									<td className="px-4 py-2">{cat.name}</td>
									<td className="px-4 py-2">{cat.slug}</td>
									<td className="px-4 py-2">{cat.parent?.name || "-"}</td>
									<td className="px-4 py-2 flex gap-2">
										<Link
											href={`/admin/manageblogs/categories/edit/${cat._id}`}
											className="text-blue-600 hover:underline"
										>
											<Edit size={18} />
										</Link>
										<button
											onClick={() => handleDelete(cat._id)}
											className="text-red-600 hover:text-red-800"
										>
											<Trash2 size={18} />
										</button>
									</td>
								</tr>
							))}
						</tbody>
					</table>
				</div>
			)}
			<div className="mt-4 flex justify-between">
				<button
					onClick={() =>
						pagination.currentPage > 1 &&
						fetchCategories(pagination.currentPage - 1)
					}
					disabled={pagination.currentPage <= 1 || loading}
					className="px-4 py-2 bg-gray-200 rounded disabled:opacity-50"
				>
					Previous
				</button>
				<span>
					Page {pagination.currentPage} of {pagination.totalPages}
				</span>
				<button
					onClick={() =>
						pagination.currentPage < pagination.totalPages &&
						fetchCategories(pagination.currentPage + 1)
					}
					disabled={pagination.currentPage >= pagination.totalPages || loading}
					className="px-4 py-2 bg-gray-200 rounded disabled:opacity-50"
				>
					Next
				</button>
			</div>
		</div>
	);
}
