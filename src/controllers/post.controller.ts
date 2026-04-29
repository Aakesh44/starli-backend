import type { NextFunction, Request, Response } from 'express';
import postService from '../services/post.service.js';
import { BadRequest } from '../utils/errors.js';
import type { AuthenticatedRequest } from '../middleware/auth.middleware.js';

const get = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    try {

        const userId = req.user!.userId;

        console.log("req.validated?.query:", req.validated?.query);

        const { author, cursor, limit, q, tag, filter } = req.validated?.query;

        const posts = await postService.get({ userId, author, cursor, limit, q, tag, filter });

        return res.status(200).json({
            posts,
            success: true,
            message: "Posts fetched successfully"
        });

    } catch (error) {
        next(error);
    }
};

const getPostById = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    try {

        const { id: postId } = req.validated?.params;
        const userId = req.user!.userId;


        if (!postId) throw BadRequest("Post id is required");

        const post = await postService.getPostById(postId, userId);

        return res.status(200).json({
            post,
            success: true,
            message: "Post fetched successfully"
        });

    } catch (error) {
        next(error);
    }
}

const create = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    try {

        const userId = req.user!.userId;

        const { title, content, status, tag, scheduledAt } = req.validated?.body;
        const media = req.files;

        const post = await postService.create({
            userId,
            title,
            content,
            status,
            scheduledAt,
            media: [],
            tag
        });

        return res.status(201).json({
            post,
            success: true,
            message: `Post ${status === "PUBLISHED" ? "published" : status === "DRAFT" ? "drafted" : "scheduled"} successfully`
        });


    } catch (error) {
        next(error);
    }
};

const update = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    try {

        const userId = req.user!.userId;

        const { id: postId } = req.validated?.params;

        if (!postId) throw BadRequest("Post id is required");

        const { id, title, content, status, tag, scheduledAt } = req.validated?.body;
        const media = req.files;

        const post = await postService.update({
            userId,
            postId: id,
            title,
            content,
            status,
            scheduledAt,
            media: [],
            tag
        });

        return res.status(201).json({
            post,
            success: true,
            message: `Post ${status === "PUBLISHED" ? "published" : status === "DRAFT" ? "drafted" : "scheduled"} successfully`
        });

    } catch (error) {
        next(error);
    }
};

const getPostLikes = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    try {

        const { id: postId } = req.validated?.params;
        const userId = req.user!.userId;

        if (!postId) throw BadRequest("Post id is required");

        const likes = await postService.getPostLikes(postId, userId);

        return res.status(200).json({
            likes,
            success: true,
            message: "Post likes fetched successfully"
        });

    } catch (error) {
        next(error);
    }
};

const likeToPost = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    try {
        const userId = req.user!.userId;

        const { id: postId } = req.validated?.params;

        if (!postId) throw BadRequest("Post id is required");

        const post = await postService.likeToPost({
            postId: postId,
            userId
        });

        return res.status(200).json({
            post,
            success: true,
            message: "Post reacted successfully"
        });

    } catch (error) {
        next(error);
    }
};

const removeLikeFromPost = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    try {
        const userId = req.user!.userId;

        const { id: postId } = req.validated?.params;

        if (!postId) throw BadRequest("Post id is required");

        const post = await postService.removeLikeFromPost({
            postId: postId,
            userId
        });

        return res.status(200).json({
            post,
            success: true,
            message: "Post reacted successfully"
        });

    } catch (error) {
        next(error);
    }
};

const deletePost = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    try {

        const userId = req.user!.userId;

        const { id: postId } = req.validated?.params;

        if (!postId) throw BadRequest("Post id is required");

        const post = await postService.deletePost(postId, userId);

        return res.status(200).json({
            post,
            success: true,
            message: "Post deleted successfully"
        });

    } catch (error) {
        next(error);
    }
};

const postController = {
    get,
    getPostById,
    create,
    update,
    getPostLikes,
    likeToPost,
    removeLikeFromPost,
    deletePost
};

export default postController;