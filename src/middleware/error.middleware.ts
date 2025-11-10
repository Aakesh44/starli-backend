import type {Request, Response, NextFunction, Router} from "express";
import {AppError} from "../utils/errors.js";

export function errorHandler(err: unknown, _req: Request, res: Response, _next: NextFunction){

    if(err instanceof AppError){
        return res.status(err.statusCode).json({message: err.message, success: false});
    }
    console.error(err);
    return res.status(500).json({message: "Internal server error", success: false});
}