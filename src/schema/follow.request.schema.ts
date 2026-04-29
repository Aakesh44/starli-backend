
import { z } from 'zod';

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
    createFollowRequestSchema,
    deleteFollowRequestSchema
};

export default followRequestSchema;