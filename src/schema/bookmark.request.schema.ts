import z from "zod";

const createBookmarkSchema = z.object({
    body: z.object({
        targetId: z.string().min(1, "Target id is required"),
        targetType: z.enum(["POST", "COMMENT"]).default("POST")
    })
});

const getBookmarksSchema = z.object({
    query: z.object({
        cursor: z.string().optional(),
        limit: z
            .string()
            .transform((limit) => parseInt(limit))
            .refine((n) => !isNaN(n) && n > 0 && n <= 50, "Limit must be a number between 1 and 50")
            .optional()
            .default(10),
    })
})

const deleteBookmarkSchema = z.object({
    params: z.object({
        postId: z.string().min(1, "Post id is required")
    })
});

const bookmarkSchema = {
    createBookmarkSchema,
    getBookmarksSchema,
    deleteBookmarkSchema
};

export default bookmarkSchema;