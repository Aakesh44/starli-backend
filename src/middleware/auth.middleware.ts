import jwt from "jsonwebtoken";
import type { Request, Response, NextFunction } from "express";
import { Unauthorized } from "../utils/errors.js";

export interface AuthenticatedRequest extends Request {
    user?: {
        userId: string;
        role: "USER" | "ADMIN";
    }
};

interface AccessTokenPayload extends jwt.JwtPayload {
    userId: string;
    role: "USER" | "ADMIN";
}

export const authenticate = (
    req: AuthenticatedRequest,
    res: Response,
    next: NextFunction
) => {

    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
        return res.status(401).json({ success: false, message: "Unauthorized" });
    }

    const token = authHeader.split(" ")[1] as string;

    try {

        const payload = jwt.verify(
            token,
            process.env.JWT_SECRET!
        ) as AccessTokenPayload;

        if (payload.exp && payload.exp < Date.now() / 1000) {
            throw Unauthorized("Token has expired");
        }

        console.log("Payload:", payload);

        if (!payload?.userId || !payload?.role) {
            throw Unauthorized("Invalid token");
        }

        req.user = {
            userId: payload.userId,
            role: payload.role
        };

        console.log("Authenticated user:", req.user);

        next();

    } catch (error) {
        throw Unauthorized("Invalid token");
    }
};