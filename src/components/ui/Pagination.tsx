"use client";

import React from "react";
import { ArrowLeft, ArrowRight } from "lucide-react";

interface PaginationProps {
	currentPage: number;
	totalPages: number;
	onPageChange: (page: number) => void;
}

const Pagination: React.FC<PaginationProps> = ({
	currentPage,
	totalPages,
	onPageChange,
}) => {
	// Calculate page numbers to display
	const getPageNumbers = () => {
		const maxPagesToShow = 5;
		const pages: (number | string)[] = [];

		if (totalPages <= maxPagesToShow) {
			// Show all pages if totalPages is small
			for (let i = 1; i <= totalPages; i++) {
				pages.push(i);
			}
		} else {
			// Show first page, last page, current page, and nearby pages
			const startPage = Math.max(2, currentPage - 1);
			const endPage = Math.min(totalPages - 1, currentPage + 1);

			// Always show page 1
			pages.push(1);

			// Add ellipsis if startPage > 2
			if (startPage > 2) {
				pages.push("...");
			}

			// Add pages around currentPage
			for (let i = startPage; i <= endPage; i++) {
				pages.push(i);
			}

			// Add ellipsis if endPage < totalPages - 1
			if (endPage < totalPages - 1) {
				pages.push("...");
			}

			// Always show last page
			if (totalPages > 1) {
				pages.push(totalPages);
			}
		}

		return pages;
	};

	const pageNumbers = getPageNumbers();

	return (
		<div className="flex justify-center items-center gap-2 mt-4">
			{/* Previous Button */}
			<button
				type="button"
				onClick={() => onPageChange(currentPage - 1)}
				disabled={currentPage === 1}
				className="w-8 h-8 flex items-center justify-center rounded-full bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-300"
				title="Previous page"
			>
				<ArrowLeft size={18} />
			</button>

			{/* Page Numbers */}
			{pageNumbers.map((page, index) =>
				typeof page === "string" ? (
					<span key={`ellipsis-${index}`} className="px-3 text-gray-500">
						...
					</span>
				) : (
					<button
						key={page}
						type="button"
						onClick={() => onPageChange(page)}
						className={`w-8 h-8 flex items-center justify-center rounded-full ${
							page === currentPage
								? "bg-primary text-white"
								: "bg-gray-200 hover:bg-gray-300"
						}`}
						title={`Page ${page}`}
					>
						{page}
					</button>
				)
			)}

			{/* Next Button */}
			<button
				type="button"
				onClick={() => onPageChange(currentPage + 1)}
				disabled={currentPage === totalPages}
				className="w-8 h-8 flex items-center justify-center rounded-full bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-300"
				title="Next page"
			>
				<ArrowRight size={18} />
			</button>
		</div>
	);
};

export default Pagination;
