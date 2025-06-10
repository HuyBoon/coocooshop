"use client";

import React, { useRef, useState } from "react";
import { toast } from "sonner";
import { Upload, Trash2 } from "lucide-react";
import { FileImage } from "lucide-react";
import Resizer from "react-image-file-resizer";

const MAX_FILE_SIZE_MB = 10;
const MAX_FILES = 10;

interface ImageManagerProps {
	onUploaded?: () => void;
}

const categories = [
	"banner",
	"category-tour",
	"tour",
	"blog",
	"member",
	"visa",
	"other",
];

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

const ImageManager: React.FC<ImageManagerProps> = ({ onUploaded }) => {
	const fileRef = useRef<HTMLInputElement | null>(null);
	const dropRef = useRef<HTMLDivElement | null>(null);
	const [category, setCategory] = useState("banner");

	const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
	const [loading, setLoading] = useState(false);

	const validateFiles = (files: FileList | File[]): File[] => {
		const newFiles = Array.from(files);

		if (selectedFiles.length + newFiles.length > MAX_FILES) {
			toast.error(`Chỉ được chọn tối đa ${MAX_FILES} ảnh.`);
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

	const handleFileChange = async (files: FileList | null) => {
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
		handleFileChange(files);
	};

	const handleRemoveImage = (index: number) => {
		setSelectedFiles((prev) => prev.filter((_, i) => i !== index));
	};

	const handleUpload = async () => {
		if (selectedFiles.length === 0) {
			toast.error("Vui lòng chọn ảnh trước.");
			return;
		}

		setLoading(true);

		const formData = new FormData();
		formData.append("category", category);
		selectedFiles.forEach((file) => formData.append("files", file));

		try {
			const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/upload`, {
				method: "POST",
				body: formData,
			});
			const result = await res.json();
			if (result.success) {
				toast.success("Tải ảnh thành công!");
				setSelectedFiles([]);
				onUploaded?.();
			} else {
				toast.error("Lỗi khi tải ảnh.");
			}
		} catch (error) {
			toast.error("Upload thất bại.");
		} finally {
			setLoading(false);
		}
	};

	return (
		<div className="bg-white p-6 rounded-lg shadow-lg space-y-6 overflow-auto max-h-[500px]">
			<div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
				<div className="flex items-center gap-3 flex-1 min-w-0">
					<h4 className="text-lg font-semibold whitespace-nowrap">
						Chọn thư mục
					</h4>
					<select
						value={category}
						onChange={(e) => setCategory(e.target.value)}
						disabled={loading}
						className="appearance-none border min-w-[100px] border-gray-300 px-4 py-2 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white bg-no-repeat bg-right w-full sm:w-auto"
						style={{
							backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='24' height='24' viewBox='0 0 24 24'%3E%3Cpath fill='%23777' d='M7 10l5 5 5-5H7z'/%3E%3C/svg%3E")`,
							backgroundPosition: "right 0.75rem center",
							backgroundSize: "1rem",
						}}
						aria-label="Chọn danh mục hình ảnh"
					>
						{categories.map((cat) => (
							<option key={cat} value={cat}>
								{cat.charAt(0).toUpperCase() + cat.slice(1)}
							</option>
						))}
					</select>
				</div>

				<div className="flex items-center gap-3">
					<button
						onClick={() => fileRef.current?.click()}
						className="cursor-pointer min-w-[120px] bg-blue-600 text-white px-4 py-2 rounded-md flex items-center justify-center gap-2 hover:bg-blue-700 disabled:opacity-50 transition"
						disabled={loading}
					>
						<Upload size={18} /> Chọn ảnh
					</button>

					<button
						onClick={handleUpload}
						className="cursor-pointer min-w-[120px] bg-green-600 text-white px-4 py-2 rounded-md flex items-center justify-center gap-2 hover:bg-green-700 disabled:opacity-50 transition"
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
				onChange={(e) => handleFileChange(e.target.files)}
			/>

			<div
				ref={dropRef}
				onDragOver={(e) => e.preventDefault()}
				onDrop={handleDrop}
				className="border-2 border-dashed rounded-lg p-10 text-center text-gray-400 hover:border-blue-400 transition cursor-pointer flex flex-col items-center justify-center gap-2"
			>
				<FileImage size={40} className="opacity-60" />
				<p className="text-sm">Kéo thả ảnh vào đây hoặc bấm "Chọn ảnh"</p>
				<p className="text-xs text-gray-400">
					Tối đa {MAX_FILES} ảnh, mỗi ảnh ≤ {MAX_FILE_SIZE_MB}MB
				</p>
			</div>

			{selectedFiles.length > 0 && (
				<div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
					{selectedFiles.map((file, idx) => {
						const objectURL = URL.createObjectURL(file);
						return (
							<div
								key={idx}
								className="relative border rounded overflow-hidden group"
							>
								<img
									src={objectURL}
									alt={`preview-${idx}`}
									className="w-full h-40 object-cover"
								/>
								<button
									type="button"
									onClick={() => handleRemoveImage(idx)}
									className="absolute top-1 right-1 bg-red-600 text-white p-1 rounded-full hover:bg-red-700 cursor-pointer"
									title="Xoá ảnh"
								>
									<Trash2 size={16} />
								</button>
							</div>
						);
					})}
				</div>
			)}
		</div>
	);
};

export default ImageManager;
