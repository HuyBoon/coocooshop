import { model, models, Schema, Document, Types } from "mongoose";

// Interface cho Product document
export interface IProduct extends Document {
    name: string;
    slug: string;
    description?: string;
    price: number;
    stock: number;
    images: { url: string; public_id: string }[];
    categories: Types.ObjectId[];
    tags: string[]; // Thêm tags để hỗ trợ lọc chi tiết
    attributes?: {
        height?: string;
        careLevel?: "easy" | "medium" | "hard";
        lightRequirement?: "low" | "medium" | "high";
        petFriendly?: boolean;
    }; // Thuộc tính bổ sung
    createdAt: Date;
    updatedAt: Date;
}

const ProductSchema = new Schema<IProduct>(
    {
        name: {
            type: String,
            required: [true, "Tên sản phẩm là bắt buộc"],
            trim: true,
            maxlength: [200, "Tên sản phẩm không được vượt quá 200 ký tự"],
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
            maxlength: [2000, "Mô tả không được vượt quá 2000 ký tự"],
        },
        price: {
            type: Number,
            required: [true, "Giá sản phẩm là bắt buộc"],
            min: [0, "Giá sản phẩm không được nhỏ hơn 0"],
        },
        stock: {
            type: Number,
            required: [true, "Số lượng tồn kho là bắt buộc"],
            min: [0, "Số lượng tồn kho không được nhỏ hơn 0"],
        },
        images: [
            {
                url: {
                    type: String,
                    required: [true, "Hình ảnh sản phẩm là bắt buộc"],
                },
                public_id: {
                    type: String,
                    required: [true, "Public ID của hình ảnh là bắt buộc"],
                },
            },
        ],
        categories: [
            {
                type: Schema.Types.ObjectId,
                ref: "ProductCategory",
                required: [true, "Danh mục sản phẩm là bắt buộc"],
            },
        ],
        tags: [
            {
                type: String,
                trim: true,
                maxlength: [50, "Tag không được vượt quá 50 ký tự"],
            },
        ],
        attributes: {
            height: { type: String, trim: true },
            careLevel: { type: String, enum: ["easy", "medium", "hard"] },
            lightRequirement: { type: String, enum: ["low", "medium", "high"] },
            petFriendly: { type: Boolean, default: false },
        },
    },
    {
        timestamps: true,
    }
);

// Index để tối ưu tìm kiếm
ProductSchema.index({ name: "text", slug: "text", tags: "text" });

export const Product = models?.Product || model<IProduct>("Product", ProductSchema);