import { model, models, Schema } from "mongoose";

const GallerySchema = new Schema(
    {
        category: { type: String, required: true },
        images: [
            {
                imgUrl: { type: String, required: true },
                public_id: { type: String, required: true },
            },
        ],
    },
    { timestamps: true }
);

export const Gallery = models.Gallery || model("Gallery", GallerySchema);
