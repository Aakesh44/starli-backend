import z from "zod";
import { CommentTargetType } from "../models/comment.model.js";


const createPostSchema = z.object({
    body: z.object({
        targetId: z.string().min(1, "Target id is required"),
        targetType: z.enum(CommentTargetType, "Target type is required"),
        parentId: z.string().optional(),
        content: z.string().min(1, "Content must be at least 1 characters long").max(2000, "Content must be at most 2000 characters long"),
    })
});

const getCommentsSchema = z.object({
    query: z.object({
        targetId: z.string().min(1, "Target id is required"),
        targetType: z.enum(CommentTargetType, "Target type is required"),
        limit: z
            .string()
            .transform((limit) => parseInt(limit))
            .refine((n) => !isNaN(n) && n > 0 && n <= 10, "Limit must be a number between 1 and 10")
            .optional()
            .default(5),
    })
});

const getCommentRepliesSchema = z.object({
    params: z.object({
        commentId: z.string().min(1, "Comment id is required")
    })
});

const updateCommentSchema = z.object({
    params: z.object({
        commentId: z.string().min(1, "Comment id is required")
    }),
    body: z.object({
        content: z.string().min(1, "Content must be at least 1 characters long").max(2000, "Content must be at most 2000 characters long"),
    })
});

const likeToCommentSchema = z.object({
    params: z.object({
        commentId: z.string().min(1, "Comment id is required")
    })
});

const removeLikeFromCommentSchema = z.object({
    params: z.object({
        commentId: z.string().min(1, "Comment id is required")
    })
});

const deleteCommentSchema = z.object({
    params: z.object({
        commentId: z.string().min(1, "Comment id is required")
    })
});

const commentRequestSchema = {
    createPostSchema,
    getCommentsSchema,
    getCommentRepliesSchema,
    updateCommentSchema,
    likeToCommentSchema,
    removeLikeFromCommentSchema,
    deleteCommentSchema
};

export default commentRequestSchema;