"use client";

import React, { useRef, useState } from "react";
import { toast } from "sonner";
import { Upload, FileImage, Trash2 } from "lucide-react";
import Resizer from "react-image-file-resizer";

interface ImageData {
	url: string;
	publicId: string;
}

const MAX_FILE_SIZE_MB = 2;
const DEFAULT_MAX_FILES = 10;

interface ImageComponentProps {
	setImagePublicIds: (data: ImageData[]) => void;
	onUploaded?: () => void;
	maxFiles?: number;
	category: string; // New prop for upload category
}

const resizeFile = (file: File): Promise<File> => {
	return new Promise((resolve, reject) => {
		Resizer.imageFileResizer(
			file,
			800,
			800,
			"JPEG",
			80,
			0,
			(result) => {
				if (result instanceof Blob) {
					const resizedFile = new File([result], file.name, {
						type: "image/jpeg",
					});
					resolve(resizedFile);
				} else {
					reject(new Error("Failed to resize image: result is not a Blob"));
				}
			},
			"blob"
		);
	});
};

const ImageComponent: React.FC<ImageComponentProps> = ({
	setImagePublicIds,
	onUploaded,
	maxFiles = DEFAULT_MAX_FILES,
	category,
}) => {
	const fileRef = useRef<HTMLInputElement | null>(null);
	const dropRef = useRef<HTMLDivElement | null>(null);
	const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
	const [loading, setLoading] = useState(false);

	const validateFiles = (files: FileList | File[]): File[] => {
		const newFiles = Array.from(files);

		if (selectedFiles.length + newFiles.length > maxFiles) {
			toast.error(`Chỉ được chọn tối đa ${maxFiles} ảnh.`);
			return [];
		}

		const valid: File[] = [];

		for (const file of newFiles) {
			if (!file.type.startsWith("image/")) {
				toast.warning(`"${file.name}" không phải là ảnh.`);
				continue;
			}
			if (file.size > MAX_FILE_SIZE_MB * 1024 * 1024) {
				toast.warning(`"${file.name}" vượt quá ${MAX_FILE_SIZE_MB}MB.`);
				continue;
			}
			valid.push(file);
		}

		return valid;
	};

	const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
		e.preventDefault();
		const files = e.target.files;
		if (!files) return;
		const validFiles = validateFiles(files);
		try {
			const resizePromises = validFiles.map(resizeFile);
			const resizedFiles = await Promise.all(resizePromises);
			setSelectedFiles((prev) => [...prev, ...resizedFiles]);
		} catch (error) {
			console.error("Error resizing files:", error);
			toast.error("Lỗi khi nén ảnh.");
		}
	};

	const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
		e.preventDefault();
		const files = e.dataTransfer.files;
		const validFiles = validateFiles(files);
		try {
			const resizePromises = validFiles.map(resizeFile);
			Promise.all(resizePromises).then((resizedFiles) => {
				setSelectedFiles((prev) => [...prev, ...resizedFiles]);
			});
		} catch (error) {
			console.error("Error resizing files:", error);
			toast.error("Lỗi khi nén ảnh.");
		}
	};

	const handleRemoveImage = (index: number) => {
		setSelectedFiles((prev) => prev.filter((_, i) => i !== index));
	};

	const handleUpload = async (e: React.MouseEvent<HTMLButtonElement>) => {
		e.preventDefault();
		if (selectedFiles.length === 0) {
			toast.error("Vui lòng chọn ảnh trước.");
			return;
		}

		setLoading(true);

		const formData = new FormData();
		formData.append("category", category); // Use the category prop
		selectedFiles.forEach((file) => formData.append("files", file));

		try {
			const res = await fetch(
				`${process.env.NEXT_PUBLIC_API_URL}/api/admin/upload`,
				{
					method: "POST",
					body: formData,
				}
			);

			if (!res.ok) {
				const errorData = await res.json();
				throw new Error(errorData.message || `HTTP error: ${res.status}`);
			}

			const result = await res.json();
			console.log("API response:", result);
			if (result.success && result.images && result.images.length > 0) {
				const imageData = result.images.map(
					(item: { imgUrl: string; public_id: string }) => ({
						url: item.imgUrl,
						publicId: item.public_id,
					})
				);
				setImagePublicIds(imageData);
				toast.success(`Tải ${imageData.length} ảnh thành công!`);
				setSelectedFiles([]);
				onUploaded?.();
			} else {
				toast.error("Không có ảnh nào được tải lên hoặc dữ liệu không hợp lệ.");
			}
		} catch (error: any) {
			console.error("Upload error:", error);
			toast.error(error.message || "Tải ảnh thất bại.");
		} finally {
			setLoading(false);
		}
	};

	return (
		<div className="bg-white p-6 rounded-lg shadow-lg">
			<div className="">
				{/* Cột trái: Khu vực chọn và tải ảnh */}
				<div className="space-y-6">
					<div className="flex items-center justify-between">
						<h4 className="text-lg font-semibold">Tải ảnh</h4>
						<div className="flex items-center gap-3">
							<button
								type="button"
								onClick={() => fileRef.current?.click()}
								className="min-w-[120px] bg-blue-600 text-white px-4 py-2 rounded-md flex items-center justify-center gap-2 hover:bg-blue-700 disabled:opacity-50 transition"
								disabled={loading}
							>
								<Upload size={18} /> Chọn ảnh
							</button>
							<button
								type="button"
								onClick={handleUpload}
								className="min-w-[120px] bg-green-600 text-white px-4 py-2 rounded-md flex items-center justify-center gap-2 hover:bg-green-700 disabled:opacity-50 transition"
								disabled={loading || selectedFiles.length === 0}
							>
								Tải ảnh
							</button>
						</div>
					</div>

					<input
						ref={fileRef}
						type="file"
						accept="image/*"
						multiple
						hidden
						onChange={handleFileChange}
					/>

					<div
						ref={dropRef}
						onDragOver={(e) => e.preventDefault()}
						onDrop={handleDrop}
						className="border-2 border-dashed rounded-lg p-4 text-center text-gray-400 hover:border-blue-400 transition cursor-pointer flex flex-col items-center justify-center gap-2"
					>
						<FileImage size={20} className="opacity-60" />
						<p className="text-sm">Kéo thả ảnh vào đây hoặc bấm "Chọn ảnh"</p>
						<p className="text-xs text-gray-400">
							Tối đa {maxFiles} ảnh, mỗi ảnh ≤ {MAX_FILE_SIZE_MB}MB
						</p>
					</div>
				</div>

				{/* Cột phải: Khu vực preview ảnh */}
				{selectedFiles.length > 0 && (
					<div className="space-y-4">
						<h4 className="text-lg font-semibold">Ảnh đã chọn</h4>
						<div className="grid grid-cols-2 md:grid-cols-3 gap-4 max-h-[400px] overflow-y-auto">
							{selectedFiles.map((file, idx) => (
								<div
									key={idx}
									className="relative border rounded-lg overflow-hidden group"
								>
									<img
										src={URL.createObjectURL(file)}
										alt={`preview-${idx}`}
										className="w-full h-32 object-cover"
									/>
									<button
										type="button"
										onClick={() => handleRemoveImage(idx)}
										className="absolute top-2 right-2 bg-red-600 text-white p-1.5 rounded-full hover:bg-red-700 opacity-0 group-hover:opacity-100 transition-opacity"
										title="Xóa ảnh"
									>
										<Trash2 size={16} />
									</button>
								</div>
							))}
						</div>
					</div>
				)}
			</div>
		</div>
	);
};

export default ImageComponent;
