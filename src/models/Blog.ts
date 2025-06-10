import mongoose, { Schema, Document } from "mongoose";

export interface IBlog extends Document {
    category: mongoose.Types.ObjectId;
    title: string;
    slug: string;
    content: string;
    thumbnail: string;
    tags: string[];
    author: string;
    publishedDate?: Date;
    timeRead: string;
    status: "draft" | "published";
    metaDescription: string;
}

const BlogSchema: Schema = new Schema(
    {
        category: {
            type: Schema.Types.ObjectId,
            ref: "BlogCategory",
            required: [true, "Category is required"],
        },
        title: {
            type: String,
            required: [true, "Title is required"],
            trim: true,
        },
        slug: {
            type: String,
            required: [true, "Slug is required"],
            unique: true,
            trim: true,
            lowercase: true,
            match: [/^[a-z0-9-]+$/, "Slug must contain only lowercase letters, numbers, and hyphens"],
        },
        metaDescription: {
            type: String,
            default: "",
            trim: true,
        },
        content: {
            type: String,
            default: "",
        },
        thumbnail: {
            type: String,
            default: "",
        },
        tags: {
            type: [String],
            default: [],
        },
        author: {
            type: String,
            default: "",
            trim: true,
        },
        publishedDate: {
            type: Date,
        },
        timeRead: {
            type: String,
            default: "",
        },
        status: {
            type: String,
            enum: ["draft", "published"],
            default: "draft",
        },
    },
    {
        timestamps: true,
    }
);

export const Blog = mongoose.models.Blog || mongoose.model<IBlog>("Blog", BlogSchema);