// src/types/express.d.ts

import "express";

declare module "express-serve-static-core" {
    interface Request {

        // auth middleware payload
        user?: {
            userId: string;
            role: "USER" | "ADMIN";
        };

        // zod validator
        validated?: {
            body?: any;
            query?: any;
            params?: any;
        };
    }

}
