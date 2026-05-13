import type { CommentTargetType } from "../models/comment.model.js";
import { Post } from "../models/post.model.js";
import commentRepository from "../repositories/comment.repository.js";
import postRepository from "../repositories/post.repository.js";
import reactionRepository from "../repositories/reaction.repository.js";
import type { IMedia } from "../schemas/media.schema.js";
import { NotFound } from "../utils/errors.js";

const create = async (userId: string, targetId: string, targetType: CommentTargetType, parentId: string, content: string, media: IMedia[]) => {

    let comment;

    console.log("Creating reply to comment: ", parentId);

    if (parentId) {

        const parentComment = await commentRepository.findOne({ _id: parentId });

        if (!parentComment) throw NotFound("Parent comment not found");

        comment = await commentRepository.create({
            author: userId,
            targetId: parentComment.targetId,
            targetType: parentComment.targetType,
            content,
            parentId,
            media
        });

    }
    else {
        comment = await commentRepository.create({ author: userId, targetId, targetType, content, media: media });
    }

    if (!comment) throw NotFound("Comment could not be created");

    if (targetType === "POST") {
        await postRepository.updateCounterToPost(targetId, "comments", 1);
        if (parentId) {
            await commentRepository.updateCounterToComment(parentId, "replies", 1);
        }
    };

    return { ...comment, liked: false };

};

const getComments = async (userId: string, targetId: string, targetType: CommentTargetType, cursor: string, limit: number) => {

    const conditions: Record<string, any> = {
        isDeleted: false,
        targetId,
        targetType,
        parentId: null
    };

    let sort: any = {
        'counts.likes': -1,
        'counts.replies': -1,
        createdAt: -1,
        // _id: -1,
    };


    const comments = await commentRepository.find({ conditions, cursor, limit, sort });

    if (!comments) throw NotFound("Comments not found");

    const reactionMap = new Map();

    const reactions = await reactionRepository
        .checkIfUserReactedList(userId, comments?.items?.map((comment) => comment?.id!), "COMMENT");

    reactions.forEach((reaction) => {
        reactionMap.set(reaction.targetId, reaction.reactionType);
    });

    return {
        items: comments.items.map(comment => ({ ...comment, liked: reactionMap.get(comment.id) === "LIKE" })),
        hasMore: comments.hasMore,
        cursor: comments.nextCursor
    }

    // return comments.map(comment => ({ ...comment, liked: reactionMap.get(comment.id) === "LIKE" }));

};

const getCommentReplies = async (userId: string, commentId: string, cursor: string, limit: number) => {

    const conditions: Record<string, any> = {
        isDeleted: false,
        parentId: commentId
    };

    let sort: any = {
        createdAt: 1,
        // _id: -1,
        // 'counts.likes': -1,
        // 'counts.replies': -1,
    };

    const replies = await commentRepository.find({
        conditions,
        sort,
        limit,
        cursor
    });

    const reactionMap = new Map();

    const reactions = await reactionRepository
        .checkIfUserReactedList(userId, replies?.items?.map((comment) => comment?.id!), "COMMENT");

    reactions.forEach((reaction) => {
        reactionMap.set(reaction.targetId, reaction.reactionType);
    });

    return {
        items: replies.items?.map(comment => ({ ...comment, liked: reactionMap.get(comment.id) === "LIKE" })),
        hasMore: replies.hasMore,
        cursor: replies.nextCursor
    }

    return

};

const updateComment = async (commentId: string, content: string) => {

    const comment = await commentRepository.update(commentId, { content });

    return comment;
};

const likeToComment = async (commentId: string, userId: string) => {

    const comment = await commentRepository.likeToComment(commentId, userId);

    return comment;
};

const removeLikeFromComment = async (commentId: string, userId: string) => {

    const comment = await commentRepository.removeLikeFromComment(commentId, userId);

    return comment;
};

const deleteComment = async (commentId: string) => {

    const comment = await commentRepository.deleteCommentById(commentId);

    return comment;
};

const commentService = {
    create,
    getComments,
    getCommentReplies,
    updateComment,
    likeToComment,
    removeLikeFromComment,
    deleteComment
}

export default commentService