"use client";

import React from "react";
import { Trash2, Edit } from "lucide-react";
import Link from "next/link";
import { useProducts } from "@/hooks/useProducts";
import Pagination from "@/components/ui/Pagination";
import Loading from "../Loading";

interface ProductCard {
	_id: string;
	name: string;
	slug: string;
	price: number;
	discountPrice?: number;
	stock: number;
	thumbnail: { url: string; public_id: string } | null;
	categories: { _id: string; name: string }[];
	details: string;
}

interface PaginationData {
	totalItems: number;
	totalPages: number;
	currentPage: number;
	pageSize: number;
}

interface AdminProductListProps {
	apiUrl: string;
	initialProducts: ProductCard[];
	initialPagination: PaginationData;
}

const AdminProductList: React.FC<AdminProductListProps> = ({
	apiUrl,
	initialProducts,
	initialPagination,
}) => {
	const {
		products,
		pagination,
		loading,
		handleDeleteProduct,
		handlePageChange,
	} = useProducts(apiUrl, initialProducts, initialPagination);

	return (
		<div className="p-4 rounded-sm shadow-sm border mt-5 bg-white">
			{loading ? (
				<Loading />
			) : products.length === 0 ? (
				<p className="text-center text-gray-500">Chưa có sản phẩm nào</p>
			) : (
				<>
					<table className="w-full border-collapse text-sm">
						<thead>
							<tr className="bg-gray-100 text-center">
								<th className="border p-2">Thumbnail</th>
								<th className="border p-2">Tên sản phẩm</th>
								<th className="border p-2">Danh mục</th>
								<th className="border p-2">Giá</th>
								<th className="border p-2">Tồn kho</th>
								<th className="border p-2">Hành động</th>
							</tr>
						</thead>
						<tbody>
							{products.map((product) => (
								<tr key={product._id} className="hover:bg-gray-50">
									<td className="border p-3">
										<img
											src={product.thumbnail?.url ?? "/placeholder-image.jpg"}
											alt={product.name}
											className="w-24 h-12 object-cover rounded-md mx-auto"
										/>
									</td>
									<td className="border p-3">{product.name}</td>
									<td className="border p-3">
										{product.categories.map((cat) => cat.name).join(", ")}
									</td>
									<td className="border p-3">
										{product.discountPrice
											? `$${product.discountPrice} (Gốc: $${product.price})`
											: `$${product.price}`}
									</td>
									<td className="border p-3">{product.stock}</td>
									<td className="border p-3">
										<div className="flex items-center justify-center gap-2">
											<Link
												href={`/admin/manageproducts/products/edit/${product._id}`}
												className="flex items-center justify-center"
											>
												<button
													type="button"
													title="Chỉnh sửa sản phẩm"
													className="text-blue-500 hover:text-blue-700"
												>
													<Edit size={18} />
												</button>
											</Link>
											<button
												type="button"
												title="Xóa sản phẩm"
												onClick={() => handleDeleteProduct(product._id)}
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

export default AdminProductList;
