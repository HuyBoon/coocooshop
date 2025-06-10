import mongoose, { Schema, Document } from "mongoose";

export interface IBlogCategory extends Document {
    name: string;
    slug: string;
    description?: string;
    createdAt: Date;
    updatedAt: Date;
}

const BlogCategorySchema: Schema = new Schema(
    {
        name: { type: String, required: true, trim: true },
        slug: { type: String, required: true, unique: true, trim: true },
        description: { type: String, trim: true },
    },
    {
        timestamps: true,
    }
);


export const BlogCategory = mongoose.models.BlogCategory || mongoose.model<IBlogCategory>("BlogCategory", BlogCategorySchema);