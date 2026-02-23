import mongoose, { Schema, Types } from "mongoose";

export interface IPost {
    _id: Types.ObjectId;
    author: Types.ObjectId;
    title: string;
    content: string;
    media: {
        url: string;
        type: "IMAGE" | "VIDEO";
    }[];
    tag: string | null;
    status: "PUBLISHED" | "DRAFT" | "SCHEDULED";
    scheduledAt: Date | null;
    isReshare: boolean;
    originalPost: Types.ObjectId | null;
    counts: {
        comments: number;
        likes: number;
        dislikes: number;
    };
    createdAt: Date;
    updatedAt: Date;
};

const postSchema = new Schema({

    author: {
        type: Types.ObjectId,
        ref: 'User',
        required: true,
        index: true
    },
    title: {
        type: String,
        trim: true,
        maxLength: 100,
        required: true
    },
    content: {
        type: String,
        trim: true,
        maxLength: 2000,
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
    ],
    status: {
        type: String,
        enum: ['PUBLISHED', 'DRAFT', 'SCHEDULED'],
        default: 'PUBLISHED',
        index: true
    },

    scheduledAt: {
        type: Date,
        default: null,
        index: true
    },

    isReshare: {
        type: Boolean,
        default: false
    },

    originalPost: {
        type: Types.ObjectId,
        ref: 'Post'
    },

    counts: {
        comments: {
            type: Number,
            default: 0
        },
        reshares: {
            type: Number,
            default: 0
        },
        reactions: {
            type: Number,
            default: 0
        }
    },

    tag: {
        type: String,
        trim: true,
        lowercase: true,
        default: "#today"
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

postSchema.index({ status: 1, isDeleted: 1, createdAt: -1, _id: -1 });
postSchema.index({ author: 1, createdAt: -1 });
postSchema.index({ tag: 1, createdAt: -1 });

const transformShared = (_doc: any, ret: any) => {
    ret.id = ret._id?.toString();
    delete ret._id;
    delete ret.__v;
    return ret;
};

// 2. Apply it to both settings
postSchema.set("toObject", { transform: transformShared });
postSchema.set("toJSON", { transform: transformShared });



export const Post = mongoose.model("Post", postSchema);