import type { AuthenticatedRequest, } from "../middleware/auth.middleware.js";
import type { NextFunction, Response } from 'express';
import searchService from "../services/search.service.js";

const search = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {

    try {

        const userId = req.user?.userId || "";
        const { q, type, cursor, limit } = req.validated?.query || {};

        const search = await searchService.search({ userId, q, type, cursor, limit });

        res.status(200).json({
            success: true,
            data: search,
            message: "Search successful"
        });

    } catch (error) {
        next(error);
    }
};

const searchController = {
    search
};

export default searchController;