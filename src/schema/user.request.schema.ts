import z from "zod";


const getUserProfileByIdSchema = z.object({
    params: z.object({
        userId: z.string().min(1, "User id is required"),
    })
});

const getUserProfileByUsername = z.object({
    params: z.object({
        username: z.string().min(1, "Username is required"),
    })
});

const updateUserProfileScema = z.object({
    body: z.object({
        name: z.string().min(3, "Name must be at least 3 characters long").max(100, "Name must be at most 100 characters long"),
        username: z.string().min(3, "Username must be at least 3 characters long").max(100, "Username must be at most 100 characters long"),
        bio: z.string().min(3, "Bio must be at least 3 characters long").max(120, "Bio must be at most 1000 characters long"),
        location: z.string().min(3, "Location must be at least 3 characters long").max(100, "Location must be at most 100 characters long").optional(),
        personal_website: z.string().min(3, "Personal website must be at least 3 characters long").max(100, "Personal website must be at most 100 characters long").optional(),
        social_links: z.object({
            github: z.url().optional().or(z.literal('')),
            figma: z.url().optional().or(z.literal('')),
            peerlist: z.url().optional().or(z.literal('')),
            linkedin: z.url().optional().or(z.literal('')),
            twitter: z.url().optional().or(z.literal('')),
            instagram: z.url().optional().or(z.literal('')),
            dribbble: z.url().optional().or(z.literal('')),
        }),
        profile_tags: z.array(z.string().min(3, "Tag must be at least 3 characters long").max(100, "Tag must be at most 100 characters long")).optional()
    })
});

const updateUserProfileImageSchema = z.object({
    body: z.object({
        picture: z.string().min(3, "Picture must be at least 3 characters long").max(100, "Picture must be at most 100 characters long"),
    })
});

const updateUserProfileCoverSchema = z.object({
    body: z.object({
        cover_picture: z.string().min(3, "Cover picture must be at least 3 characters long").max(100, "Cover picture must be at most 100 characters long"),
    })
});

const userRequestSchema = {
    getUserProfileByIdSchema,
    getUserProfileByUsername,
    updateUserProfileScema,
    updateUserProfileImageSchema,
    updateUserProfileCoverSchema
};

export default userRequestSchema;