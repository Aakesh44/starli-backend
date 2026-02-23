import jwt, { type SignOptions } from "jsonwebtoken";
import { BadRequest, NotFound } from "./errors.js";

const JWT_SECRET = process.env.JWT_SECRET || "secret";

export function signJWT(payload: any, options?: SignOptions) {
    return jwt.sign(
        payload,
        JWT_SECRET,
        {
            expiresIn: "1d",
            ...options
        }
    )
};

export function verifyJWT<T,>(token: string): T {
    try {

        return jwt.verify(token, JWT_SECRET) as T;

    } catch (error) {

        if (error instanceof jwt.TokenExpiredError) {
            throw NotFound("Token has expired");
        }
        else if (error instanceof jwt.JsonWebTokenError) {
            throw NotFound("Invalid token");
        }
        throw BadRequest("Invalid token");
    }
};

