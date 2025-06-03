import mongoose, { Schema, model, models } from 'mongoose';

const AdminUserSchema = new Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    avatar: { type: String, default: "" },
    role: { type: String, default: "instructor" },
    admin: { type: Boolean, default: false },
    superAdmin: { type: Boolean, default: false },
}, { timestamps: true });

export const AdminUser = models.AdminUser || model("AdminUser", AdminUserSchema);
