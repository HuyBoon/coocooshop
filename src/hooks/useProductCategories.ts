"use client";

import { useState, useCallback } from "react";
import { toast } from "sonner";

interface Category {
    _id: string;
    name: string;
    slug: string;
    thumbnail: { url: string; public_id: string };
    type: string;
}

interface Pagination {
    totalItems: number;
    totalPages: number;
    currentPage: number;
    pageSize: number;
}

interface UseProductCategoriesReturn {
    categories: Category[];
    pagination: Pagination;
    loading: boolean;
    handleDeleteCategory: (id: string) => Promise<void>;
    handlePageChange: (newPage: number) => void;
}

export const useProductCategories = (
    apiUrl: string,
    initialCategories: Category[] = [],
    initialPagination: Pagination = {
        totalItems: 0,
        totalPages: 1,
        currentPage: 1,
        pageSize: 10,
    }
): UseProductCategoriesReturn => {
    const [categories, setCategories] = useState<Category[]>(initialCategories);
    const [pagination, setPagination] = useState<Pagination>(initialPagination);
    const [loading, setLoading] = useState(false);

    const fetchCategories = useCallback(
        async (page: number, limit: number) => {
            setLoading(true);
            try {
                const res = await fetch(
                    `${apiUrl}/api/admin/category?page=${page}&limit=${limit}`,
                    { cache: "no-store" }
                );
                if (!res.ok) {
                    throw new Error(`Failed to fetch product categories: ${res.statusText}`);
                }
                const data = await res.json();
                if (data.success) {
                    setCategories(data.categories || []);
                    setPagination(data.pagination || initialPagination);
                } else {
                    throw new Error(data.error || "Invalid response from server");
                }
            } catch (error: any) {
                toast.error(error.message || "Không thể tải danh mục");
                setCategories([]);
                setPagination(initialPagination);
            } finally {
                setLoading(false);
            }
        },
        [apiUrl, initialPagination]
    );

    const handleDeleteCategory = useCallback(
        async (id: string) => {
            if (!confirm("Bạn có chắc chắn muốn xóa danh mục này?")) return;

            try {
                const res = await fetch(`${apiUrl}/api/admin/category/${id}`, {
                    method: "DELETE",
                });

                if (!res.ok) {
                    const errorData = await res.json();
                    throw new Error(errorData.error || "Xóa danh mục thất bại");
                }

                setCategories((prev) => prev.filter((cat) => cat._id !== id));
                toast.success("Danh mục đã được xóa");
            } catch (error: any) {
                toast.error(error.message || "Xóa danh mục thất bại");
            }
        },
        [apiUrl]
    );

    const handlePageChange = useCallback(
        (newPage: number) => {
            setPagination((prev) => ({ ...prev, currentPage: newPage }));
            fetchCategories(newPage, pagination.pageSize);
        },
        [fetchCategories, pagination.pageSize]
    );

    return {
        categories,
        pagination,
        loading,
        handleDeleteCategory,
        handlePageChange,
    };
};