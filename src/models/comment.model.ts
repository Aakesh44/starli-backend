import mongoose, { Schema, Types } from "mongoose";

const commentSchema = new Schema({

    author: {
        type: Types.ObjectId,
        ref: 'User',
        required: true,
        index: true
    },
    post: {
        type: Types.ObjectId,
        ref: 'Post', // can be post or comment
        required: true,
        index: true
    },
    parentComment: {
        type: Types.ObjectId,
        ref: 'Comment',
        default: null
    },
    content: {
        text: {
            type: String,
            trim: true,
            maxLength: 1000,
            required: true,
        },
        media: [
            {
                url: {
                    type: String,
                    required: true
                },
                type: {
                    type: String,
                    enum: ['IMAGE', 'VIDEO'],
                    required: true
                }
            }
        ]
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