"use client";

import React from "react";
import { Trash2, Edit } from "lucide-react";
import Link from "next/link";
import Pagination from "@/components/ui/Pagination";
import Loading from "../Loading";
import { useBlogCategories } from "@/hooks/useBlogCategories";

interface CategoryCard {
	_id: string;
	name: string;
	slug: string;
	description?: string;
}

interface PaginationData {
	totalItems: number;
	totalPages: number;
	currentPage: number;
	pageSize: number;
}

interface BlogCategoryListProps {
	apiUrl: string;
	initialCategories: CategoryCard[];
	initialPagination: PaginationData;
}

const BlogCategoryList: React.FC<BlogCategoryListProps> = ({
	apiUrl,
	initialCategories,
	initialPagination,
}) => {
	const {
		categories,
		pagination,
		loading,
		handleDeleteCategory,
		handlePageChange,
	} = useBlogCategories(apiUrl, initialCategories, initialPagination);

	return (
		<div className="p-4 rounded-sm shadow-sm mt-5 bg-white">
			{loading ? (
				<Loading />
			) : categories.length === 0 ? (
				<p className="text-center text-gray-500">Chưa có danh mục nào</p>
			) : (
				<>
					<table className="w-full border-collapse text-sm">
						<thead>
							<tr className="bg-gray-100 text-center">
								<th className="border p-2">Tên danh mục</th>
								<th className="border p-2">Slug</th>
								<th className="border p-2">Hành động</th>
							</tr>
						</thead>
						<tbody>
							{categories.map((category) => (
								<tr key={category._id} className="hover:bg-gray-50">
									<td className="border p-3">{category.name}</td>
									<td className="border p-3">{category.slug}</td>
									<td className="border p-3">
										<div className="flex items-center justify-center gap-2">
											<Link
												href={`/admin/manageblogs/category/edit/${category._id}`}
												className="flex items-center justify-center"
											>
												<button
													type="button"
													title="Chỉnh sửa danh mục"
													className="text-blue-500 hover:text-blue-700"
												>
													<Edit size={18} />
												</button>
											</Link>
											<button
												type="button"
												title="Xóa danh mục"
												onClick={() => handleDeleteCategory(category._id)}
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

export default BlogCategoryList;
