import type { NextFunction, Response } from "express";
import type { AuthenticatedRequest } from "../middleware/auth.middleware.js";
import bookmarkService from "../services/bookmark.service.js";

const getBookmarks = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {

    try {

        const userId = req.user!.userId;

        const { cursor, limit } = req.validated?.query;

        const bookmarks = await bookmarkService.getBookmarks({
            userId,
            cursor,
            limit
        });

        return res.status(200).json({
            success: true,
            bookmarks,
            message: "Bookmarks fetched successfully"
        });

    } catch (error) {
        next(error);
    }
};

const createBookmark = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {

    try {
        const userId = req.user!.userId;
        const { targetId, targetType } = req.body;

        const bookmark = await bookmarkService.createBookmark({
            targetId,
            targetType,
            userId
        });

        return res.status(200).json({
            success: true,
            bookmark,
            message: "Bookmark created successfully"
        });

    } catch (error) {
        next(error);
    }

};

const deleteBookmark = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {

    try {
        const userId = req.user!.userId;

        const { postId } = req.validated?.params;

        const bookmark = await bookmarkService.deleteBookmark({
            postId, userId
        });

        return res.status(200).json({
            success: true,
            bookmark,
            message: "Bookmark deleted successfully"
        });

    } catch (error) {
        next(error);
    }
};

const bookmarkController = {
    getBookmarks,
    createBookmark,
    deleteBookmark
};

export default bookmarkController;