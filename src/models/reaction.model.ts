import mongoose, { Schema, Types } from "mongoose";

const reactionSchema = new Schema({

    user: {
        type: Types.ObjectId,
        ref: 'User',
        required: true,
        index: true
    },
    targetType: {
        type: String,
        enum: ['POST', 'COMMENT'],
        required: true,
        index: true
    },
    targetId: {
        type: Types.ObjectId,
        required: true,
        index: true
    },
    reactionType: {
        type: String,
        enum: ['LIKE', 'DISLIKE'],
        required: true,
        index: true
    }

}, { timestamps: true });

reactionSchema.index({ targetType: 1, targetId: 1, reactionType: 1 });
reactionSchema.index({ targetType: 1, targetId: 1, createdAt: -1 });

export const Reaction = mongoose.model("Reaction", reactionSchema);