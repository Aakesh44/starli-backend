import mongoose, { Schema, Types } from "mongoose";

export enum CommentTargetType {
    POST = 'POST',
    COURSE = 'COURSE'
};

export interface IComment {
    _id: Types.ObjectId;
    author: Types.ObjectId;
    targetId: Types.ObjectId;
    targetType: CommentTargetType;
    parentId: Types.ObjectId | null;
    content: string;
    media: string | null;
    counts: {
        likes: number;
        replies: number;
    };
    isDeleted: boolean;
    deletedAt: Date | null;
    createdAt: Date;
    updatedAt: Date;
};

const commentSchema = new Schema({

    author: {
        type: Types.ObjectId,
        ref: 'User',
        required: true,
        index: true
    },
    targetId: {
        type: Types.ObjectId,
        required: true,
        index: true
    },
    targetType: {
        type: String,
        enum: Object.values(CommentTargetType),
        required: true,
        index: true
    },
    parentId: {
        type: Types.ObjectId,
        ref: 'Comment',
        default: null
    },
    content: {
        type: String,
        trim: true,
        maxLength: 1000,
        required: true,
    },
    media: {
        type: String,
        default: null
    },
    counts: {
        likes: {
            type: Number,
            default: 0
        },
        replies: {
            type: Number,
            default: 0
        }
    },
    isDeleted: {
        type: Boolean,
        default: false
    },
    deletedAt: {
        type: Date,
        default: null
    }

}, { timestamps: true });

commentSchema.index({ post: 1, createdAt: -1 });
commentSchema.index({ parentComment: 1, createdAt: 1 });

export const Comment = mongoose.model("Comment", commentSchema);