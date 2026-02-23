import { z } from "zod";

const signupSchema = z.object({
    body: z.object({
        email: z.email({ pattern: /.+@.+\..+/, message: "Invalid email" }),
        password: z.string().min(8, "Password must be at least 8 characters long").max(16, "Password must be at most 32 characters long"),
    })
});

const loginSchema = z.object({
    body: z.object({
        email: z.email({ pattern: /.+@.+\..+/, message: "Invalid email" }).optional(),
        password: z.string().min(8, "Password must be at least 8 characters long").max(16, "Password must be at most 32 characters long")
    })
});

const googleLoginSchema = z.object({
    body: z.object({
        idToken: z.string().min(1, "Token is required"),
    })
})

const googleLinkSchema = z.object({
    body: z.object({
        password: z.string().min(8, "Password must be at least 8 characters long").max(16, "Password must be at most 32 characters long"),
        idToken: z.string().min(1, "Token is required"),
    })
})

const verifyOtpSchema = z.object({
    body: z.object({
        token: z.string().min(1, "Token is required"),
        otp: z.string().length(6, "Enter the 6 characters otp")
    })
});

const authRequestSchema = { signupSchema, loginSchema, googleLoginSchema, verifyOtpSchema };

export default authRequestSchema;