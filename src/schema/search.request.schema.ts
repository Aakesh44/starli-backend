import z from "zod";

const searchSchema = z.object({
    query: z.object({
        q: z.string().min(1, "Search query is required").max(100, "Search query must be at most 100 characters long").optional().or(z.literal('')),
        type: z.enum(["post", "user"], "Search type must be either 'post' or 'user'").default("post"),
        cursor: z.string().optional(),
        limit: z
            .string()
            .transform((limit) => parseInt(limit))
            .refine((n) => !isNaN(n) && n > 0 && n <= 50, "Limit must be a number between 1 and 50")
            .optional()
            .default(10),
    })
});

export default searchSchema;