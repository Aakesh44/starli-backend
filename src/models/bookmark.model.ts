import mongoose, { Schema, Types } from "mongoose";

const bookmarkSchema = new Schema({

    user: {
        type: Types.ObjectId,
        ref: 'User',
        required: true,
        index: true
    },
    targetType: {
        type: String,
        enum: ['POST'],
        required: true,
        index: true
    },
    targetId: {
        type: Types.ObjectId,
        required: true,
        index: true
    }

}, { timestamps: true });

bookmarkSchema.index(
    { user: 1, targetType: 1, targetId: 1 },
    { unique: true }
)

bookmarkSchema.index({ createdAt: -1 });
bookmarkSchema.index({ user: 1, createdAt: -1 });

export const Bookmark = mongoose.model("Bookmark", bookmarkSchema);