import type { NextFunction, Response } from "express";
import type { AuthenticatedRequest } from "../middleware/auth.middleware.js";
import followService from "../services/follow.service.js";

const getFollow = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    try {

        const { userId, type, cursor, limit } = req.validated?.query;

        const result = await followService.getFollow({ userId, type, cursor, limit });

        console.log(' 🔥⚠️⚠️ result:', result);

        return res.status(200).json({
            data: result,
            success: true,
            message: "Followers fetched successfully"
        });

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

const deleteFollow = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    try {

        const userId = req.user!.userId;
        const { followingId } = req.validated?.body;

        console.log(' 🔥⚠️⚠️ followingId:', followingId);

        await followService.unfollow(userId, followingId);

        return res.status(200).json({
            followingId,
            success: true,
            message: "Unfollowed successfully"
        });

    } catch (error) {
        console.error(error);
        next(error);
    }
};

export default { getFollow, create, deleteFollow };