import { model, models, Schema, Document, Types } from "mongoose";

// Interface cho ProductCategory document
export interface IProductCategory extends Document {
    name: string;
    slug: string;
    description?: string;
    thumbnail: { url: string; public_id: string };
    type: "location" | "plant_type" | "grow_method" | "accessory" | "purpose"; // Mở rộng type
    parent?: Types.ObjectId;
    createdAt: Date;
    updatedAt: Date;
}

const ProductCategorySchema = new Schema<IProductCategory>(
    {
        name: {
            type: String,
            required: [true, "Tên danh mục là bắt buộc"],
            trim: true,
            maxlength: [100, "Tên danh mục không được vượt quá 100 ký tự"],
        },
        slug: {
            type: String,
            required: [true, "Slug là bắt buộc"],
            unique: true,
            trim: true,
            match: [/^[a-z0-9-]+$/, "Slug chỉ chứa chữ thường, số và dấu gạch ngang"],
        },
        description: {
            type: String,
            trim: true,
            maxlength: [500, "Mô tả không được vượt quá 500 ký tự"],
        },
        thumbnail: {
            url: {
                type: String,
                required: [true, "Hình ảnh đại diện là bắt buộc"],
            },
            public_id: {
                type: String,
                required: [true, "Public ID của hình ảnh là bắt buộc"],
            },
        },
        type: {
            type: String,
            enum: ["location", "plant_type", "grow_method", "accessory", "purpose"],
            required: [true, "Loại danh mục là bắt buộc"],
        },
        parent: {
            type: Schema.Types.ObjectId,
            ref: "ProductCategory",
            default: null, // Hỗ trợ danh mục con, ví dụ: "Chậu cây" thuộc "accessory"
        },
    },
    {
        timestamps: true,
    }
);

// Index để tối ưu tìm kiếm
ProductCategorySchema.index({ name: "text", slug: "text", type: 1 });

export const ProductCategory =
    models?.ProductCategory || model<IProductCategory>("ProductCategory", ProductCategorySchema);