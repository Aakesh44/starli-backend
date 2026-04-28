import type { NextFunction, Response } from "express";
import type { AuthenticatedRequest } from "../middleware/auth.middleware.js";
import commentService from "../services/comment.service.js";

const create = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    try {
        console.log("Creating comment with body: ", req.validated?.body);

        const userId = req.user!.userId;
        const { targetId, targetType, parentId, content, media } = req.validated?.body;

        const comment = await commentService.create(
            userId,
            targetId,
            targetType,
            parentId,
            content,
            media
        );

        return res.status(201).json({
            comment,
            success: true,
            message: "Comment created successfully"
        });

    } catch (error) {
        next(error);
    }
};

const getComments = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    try {

        const { targetType, targetId, limit } = req.validated?.query;

        const comments = await commentService.getComments(targetId, targetType);

        return res.status(200).json({
            comments,
            success: true,
            message: "Comments fetched successfully"
        });
    }
    catch (error) {
        next(error);
    }
};

const getCommentReplies = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    try {

        const { commentId } = req.validated?.params;

        const replies = await commentService.getCommentReplies(commentId);

        return res.status(200).json({
            replies,
            success: true,
            message: "Replies fetched successfully"
        });

    }
    catch (error) {
        next(error);
    }
};

const updateComment = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    try {

        const { commentId } = req.validated?.params;
        const { content } = req.validated?.body;

        const comment = await commentService.updateComment(commentId, content);

        return res.status(200).json({
            comment,
            success: true,
            message: "Comment updated successfully"
        });

    } catch (error) {
        next(error);
    }
};


const deleteComment = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    try {

        const { commentId } = req.validated?.params;

        await commentService.deleteComment(commentId);

        return res.status(200).json({
            success: true,
            message: "Comment deleted successfully"
        });
    }
    catch (error) {
        next(error);
    }
};

const commentController = {
    create,
    getComments,
    getCommentReplies,
    updateComment,
    deleteComment
};

export default commentController;