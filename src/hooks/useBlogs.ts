"use client";

import { useState, useCallback } from "react";
import { toast } from "sonner";

interface Blog {
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

interface UseBlogsReturn {
    blogs: Blog[];
    pagination: Pagination;
    loading: boolean;
    handleDeleteBlog: (id: string) => Promise<void>;
    handlePageChange: (newPage: number) => void;
}

export const useBlogs = (
    apiUrl: string,
    initialBlogs: Blog[] = [],
    initialPagination: Pagination = {
        totalItems: 0,
        totalPages: 1,
        currentPage: 1,
        pageSize: 10,
    }
): UseBlogsReturn => {
    const [blogs, setBlogs] = useState<Blog[]>(initialBlogs);
    const [pagination, setPagination] = useState<Pagination>(initialPagination);
    const [loading, setLoading] = useState(false);

    const fetchBlogs = useCallback(
        async (page: number, limit: number) => {
            setLoading(true);
            try {
                const res = await fetch(
                    `${apiUrl}/api/adminblogs?page=${page}&limit=${limit}`,
                    { cache: "no-store" }
                );
                if (!res.ok) {
                    throw new Error(`Failed to fetch blogs: ${res.statusText}`);
                }
                const data = await res.json();
                if (data.success) {
                    setBlogs(data.blogs || []);
                    setPagination(data.pagination || initialPagination);
                } else {
                    throw new Error(data.error || "Invalid response from server");
                }
            } catch (error: any) {
                toast.error(error.message || "Không thể tải bài viết");
                setBlogs([]);
                setPagination(initialPagination);
            } finally {
                setLoading(false);
            }
        },
        [apiUrl]
    );

    const handleDeleteBlog = async (id: string) => {
        if (!confirm("Bạn có chắc chắn muốn xóa bài viết này?")) return;

        try {
            const res = await fetch(`${apiUrl}/api/adminblogs/${id}`, {
                method: "DELETE",
            });

            if (!res.ok) {
                const errorData = await res.json();
                throw new Error(errorData.error || "Xóa bài viết thất bại");
            }

            setBlogs((prev) => prev.filter((blog) => blog._id !== id));
            toast.success("Bài viết đã được xóa");
        } catch (error: any) {
            toast.error(error.message || "Xóa bài viết thất bại");
        }
    };

    const handlePageChange = useCallback(
        (newPage: number) => {
            setPagination((prev) => ({ ...prev, currentPage: newPage }));
            fetchBlogs(newPage, pagination.pageSize);
        },
        [fetchBlogs, pagination.pageSize]
    );

    return {
        blogs,
        pagination,
        loading,
        handleDeleteBlog,
        handlePageChange,
    };
};