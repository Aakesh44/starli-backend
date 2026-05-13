import type { NextFunction, Response } from "express";
import type { AuthenticatedRequest } from "../middleware/auth.middleware.js";
import commentService from "../services/comment.service.js";
import uploadService from "../services/upload.service.js";
import type { IMedia } from "../schemas/media.schema.js";

const create = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    try {

        console.log("Creating comment with body: ", req.validated?.body);

        const userId = req.user!.userId;
        const { targetId, targetType, parentId, content } = req.validated?.body;

        const media = req.files;

        let uploadedMedia: IMedia | null = null;

        if (media && Array.isArray(media) && media[0]) {

            const uploaded = await uploadService.uploadCloudinary(media[0] as Express.Multer.File, 'COMMENT');

            uploadedMedia = {
                url: uploaded.secure_url,
                publicId: uploaded.public_id,
                type: uploaded.resource_type?.toUpperCase()
            }
        }


        const comment = await commentService.create(
            userId,
            targetId,
            targetType,
            parentId,
            content,
            uploadedMedia ? [uploadedMedia] : []
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

        const { targetType, targetId, limit, cursor } = req.validated?.query;
        const userId = req.user!.userId;

        const comments = await commentService.getComments(userId, targetId, targetType, cursor, limit);

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
        const { cursor, limit } = req.validated?.query;
        const userId = req.user!.userId;

        const replies = await commentService.getCommentReplies(userId, commentId, cursor, limit);

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

const likeToComment = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    try {

        const { commentId } = req.validated?.params;
        const userId = req.user!.userId;

        const comment = await commentService.likeToComment(commentId, userId);

        return res.status(200).json({
            comment,
            success: true,
            message: "Comment liked successfully"
        });

    }
    catch (error) {
        next(error);
    }
};

const removeLikeFromComment = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    try {

        const { commentId } = req.validated?.params;
        const userId = req.user!.userId;

        const comment = await commentService.removeLikeFromComment(commentId, userId);

        return res.status(200).json({
            comment,
            success: true,
            message: "Comment unliked successfully"
        });

    }
    catch (error) {
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
    likeToComment,
    removeLikeFromComment,
    deleteComment
};

export default commentController;