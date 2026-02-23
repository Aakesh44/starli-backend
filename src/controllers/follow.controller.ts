import type { NextFunction, Response } from "express";
import type { AuthenticatedRequest } from "../middleware/auth.middleware.js";
import followService from "../services/follow.service.js";

const get = (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    try {

    } catch (error) {
        console.error(error);
        next(error);
    }
};

const create = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    try {

        const userId = req.user!.userId;
        const { followingId } = req.body;

        await followService.follow(userId, followingId);

        return res.status(200).json({
            followingId,
            success: true,
            message: "Follow created successfully"
        });

    } catch (error) {
        console.error(error);
        next(error);
    }
};

const deleteFollow = (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    try {

    } catch (error) {
        console.error(error);
        next(error);
    }
};

export default { get, create, deleteFollow };