
import { z } from 'zod';

const getFollowSchema = z.object({
    query: z.object({
        type: z.enum(['followers', 'following'], "Type must be either 'followers' or 'following'"),
        userId: z.string().min(1, "User id is required"),
        cursor: z.string().optional(),
        limit: z
            .string()
            .transform((limit) => parseInt(limit))
            .refine((n) => !isNaN(n) && n > 0 && n <= 50, "Limit must be a number between 1 and 50")
            .optional()
            .default(10)

    })
});

const createFollowRequestSchema = z.object({
    body: z.object({
        followingId: z.string().min(1, "Following id is required")
    })
});

const deleteFollowRequestSchema = z.object({
    body: z.object({
        followingId: z.string().min(1, "Following id is required")
    })
});

const followRequestSchema = {
    getFollowSchema,
    createFollowRequestSchema,
    deleteFollowRequestSchema
};

export default followRequestSchema;