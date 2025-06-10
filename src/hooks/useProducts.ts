"use client";

import { useState, useCallback } from "react";
import { toast } from "sonner";

interface Product {
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

interface Pagination {
    totalItems: number;
    totalPages: number;
    currentPage: number;
    pageSize: number;
}

interface UseProductsReturn {
    products: Product[];
    pagination: Pagination;
    loading: boolean;
    handleDeleteProduct: (id: string) => Promise<void>;
    handlePageChange: (newPage: number) => void;
}

export const useProducts = (
    apiUrl: string,
    initialProducts: Product[] = [],
    initialPagination: Pagination = {
        totalItems: 0,
        totalPages: 1,
        currentPage: 1,
        pageSize: 10,
    }
): UseProductsReturn => {
    const [products, setProducts] = useState<Product[]>(initialProducts);
    const [pagination, setPagination] = useState<Pagination>(initialPagination);
    const [loading, setLoading] = useState(false);

    const fetchProducts = useCallback(
        async (page: number, limit: number) => {
            setLoading(true);
            try {
                const res = await fetch(
                    `${apiUrl}/api/adminproducts?page=${page}&limit=${limit}`,
                    { cache: "no-store" }
                );
                if (!res.ok) {
                    throw new Error(`Failed to fetch products: ${res.statusText}`);
                }
                const data = await res.json();
                if (data.success) {
                    setProducts(data.products || []);
                    setPagination(data.pagination || initialPagination);
                } else {
                    throw new Error(data.error || "Invalid response from server");
                }
            } catch (error: any) {
                toast.error(error.message || "Không thể tải sản phẩm");
                setProducts([]);
                setPagination(initialPagination);
            } finally {
                setLoading(false);
            }
        },
        [apiUrl]
    );

    const handleDeleteProduct = async (id: string) => {
        if (!confirm("Bạn có chắc chắn muốn xóa sản phẩm này?")) return;

        try {
            const res = await fetch(`${apiUrl}/api/adminproducts/${id}`, {
                method: "DELETE",
            });

            if (!res.ok) {
                const errorData = await res.json();
                throw new Error(errorData.error || "Xóa sản phẩm thất bại");
            }

            setProducts((prev) => prev.filter((prod) => prod._id !== id));
            toast.success("Sản phẩm đã được xóa");
        } catch (error: any) {
            toast.error(error.message || "Xóa sản phẩm thất bại");
        }
    };

    const handlePageChange = useCallback(
        (newPage: number) => {
            setPagination((prev) => ({ ...prev, currentPage: newPage }));
            fetchProducts(newPage, pagination.pageSize);
        },
        [fetchProducts, pagination.pageSize]
    );

    return {
        products,
        pagination,
        loading,
        handleDeleteProduct,
        handlePageChange,
    };
};