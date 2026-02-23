import { z } from "zod";

const getPostsSchema = z.object({
    query: z.object({
        cursor: z.string().optional(),
        limit: z
            .string()
            .transform((limit) => parseInt(limit))
            .refine((n) => !isNaN(n) && n > 0 && n <= 50, "Limit must be a number between 1 and 50")
            .optional()
            .default(10),
        author: z.string().min(1, "Author id is required").optional(),
        q:
            z.preprocess(
                (value) => {
                    console.log('value:', value);
                    if (typeof value !== "string") return undefined;
                    const trimmed = value.trim();
                    return trimmed.length > 0 ? trimmed : undefined;
                },
                z.string().min(3, "Query must be at least 3 characters long").optional()
            ),
        tag: z.string().min(1, "Tag is required").optional().transform((tag) => tag?.trim()?.toLowerCase()),
        filter: z.enum(["FOLLOWING", "TRENDING", "DRAFT", "SCHEDULED", "ALL"]).default("ALL"),
    })
});

const createPostSchema = z.object({
    body: z.object({
        title: z.string().min(3, "Title must be at least 3 characters long").max(100, "Title must be at most 100 characters long"),
        content: z.string().min(3, "Content must be at least 3 characters long").max(2000, "Content must be at most 2000 characters long"),
        status: z.enum(["DRAFT", "PUBLISHED", "SCHEDULED"]).default("DRAFT"),
        scheduledAt: z.string().optional()
            .transform((val) => (val ? new Date(val) : null)),
        tag: z.string().min(1).max(100, "Tag must be at most 100 characters long").optional(),
    }).refine((data) => {
        if (data.status === "SCHEDULED") {
            return data.scheduledAt !== null && !isNaN(data.scheduledAt.getTime());
        }
        return true;
    }, {
        message: "Scheduled time is required",
        path: ["scheduledAt"]
    })
});

const updatePostSchema = z.object({
    params: z.object({
        id: z.string().min(1, "Post id is required"),
    }),
    body: z.object({
        id: z.string().min(1, "Post id is required"),
        title: z.string().min(3, "Title must be at least 3 characters long").max(100, "Title must be at most 100 characters long"),
        content: z.string().min(3, "Content must be at least 3 characters long").max(2000, "Content must be at most 2000 characters long"),
        status: z.enum(["DRAFT", "PUBLISHED", "SCHEDULED"]).default("DRAFT"),
        scheduledAt: z.string().nullable().optional()
            .transform((val) => (val ? new Date(val) : undefined)),
        tag: z.string().min(1).max(100, "Tag must be at most 100 characters long").optional(),
    }).refine((data) => {
        if (data.status === "SCHEDULED") {
            return data.scheduledAt !== undefined && !isNaN(data.scheduledAt.getTime());
        }
        return true;
    }, {
        message: "Scheduled time is required",
        path: ["scheduledAt"]
    })
});

const deletePostSchema = z.object({
    params: z.object({
        id: z.string().min(1, "Post id is required")
    })
});

const postRequestSchema = { getPostsSchema, createPostSchema, updatePostSchema, deletePostSchema };

export default postRequestSchema;