"use client";

import { Editor } from "@tinymce/tinymce-react";
import { useRef } from "react";
import { toast } from "sonner";

interface TinyMCEEditorProps {
	value: string;
	onChange: (value: string) => void;
	category?: string;
	onImageUploaded?: (publicId: string, imgUrl: string) => void;
	height: number;
}

const TinyMCEEditor: React.FC<TinyMCEEditorProps> = ({
	value,
	onChange,
	category,
	onImageUploaded,
	height,
}) => {
	const editorRef = useRef<any>(null);

	// Handle image upload
	const imageUploadHandler = (blobInfo: any) =>
		new Promise<string>(async (resolve, reject) => {
			try {
				if (!category) {
					reject("Vui lòng nhập tên danh mục trước khi thêm hình ảnh");
					toast.error("Vui lòng nhập tên danh mục trước khi thêm hình ảnh");
					return;
				}

				const formData = new FormData();
				formData.append("files", blobInfo.blob(), blobInfo.filename());
				formData.append("category", category);

				const response = await fetch(
					`${process.env.NEXT_PUBLIC_API_URL}/api/admin/upload`,
					{
						method: "POST",
						body: formData,
					}
				);

				if (!response.ok) {
					const errorData = await response.json();
					reject(errorData.message || "Tải hình ảnh thất bại");
					toast.error(errorData.message || "Tải hình ảnh thất bại");
					return;
				}

				const result = await response.json();
				if (!result.success || !result.images || !result.images[0]) {
					reject("Phản hồi từ API không hợp lệ");
					toast.error("Phản hồi từ API không hợp lệ");
					return;
				}

				// Send public_id and imgUrl to parent component
				if (onImageUploaded && result.images[0].public_id) {
					onImageUploaded(result.images[0].public_id, result.images[0].imgUrl);
				}

				resolve(result.images[0].imgUrl);
			} catch (error: any) {
				reject(error.message || "Không thể tải hình ảnh");
				toast.error(error.message || "Không thể tải hình ảnh");
			}
		});

	return (
		<Editor
			apiKey={process.env.NEXT_PUBLIC_TINYMCE_API_KEY || "no-api-key"}
			onEditorChange={(content) => onChange(content)}
			value={value}
			init={{
				height: height,
				menubar: true,
				plugins: [
					"advlist autolink lists link image charmap print preview anchor",
					"searchreplace visualblocks code",
					"insertdatetime media table paste code help wordcount",
					"link",
					"image",
					"media",
					"table",
					"lists",
				],
				fontsize_formats: "8pt 10pt 12pt 14pt 16pt 18pt 24pt 36pt 48pt",
				toolbar:
					"undo redo | formatselect | fontsizeselect | bold italic backcolor | \
          blockquote h1 h2 h3 h4 | alignleft aligncenter alignright alignjustify | \
          bullist numlist outdent indent | image media | removeformat | table | help",
				content_style:
					"body { font-family:Helvetica,Arial,sans-serif; font-size:14px }",
				image_caption: true,
				images_upload_handler: category ? imageUploadHandler : undefined,
				file_picker_types: "image",
				automatic_uploads: true,
			}}
		/>
	);
};

export default TinyMCEEditor;
