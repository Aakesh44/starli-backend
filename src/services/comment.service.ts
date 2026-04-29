import type { CommentTargetType } from "../models/comment.model.js";
import { Post } from "../models/post.model.js";
import commentRepository from "../repositories/comment.repository.js";
import postRepository from "../repositories/post.repository.js";
import reactionRepository from "../repositories/reaction.repository.js";
import { NotFound } from "../utils/errors.js";

const create = async (userId: string, targetId: string, targetType: CommentTargetType, parentId: string, content: string, media: string[]) => {

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
            media: 'https://via.placeholder.com/150'
        });

    }
    else {
        comment = await commentRepository.create({ author: userId, targetId, targetType, content, media: 'https://via.placeholder.com/150' });
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

const getComments = async (userId: string, targetId: string, targetType: CommentTargetType) => {

    const comments = await commentRepository.find({ targetId, targetType, parentId: null });

    if (!comments) throw NotFound("Comments not found");

    if (comments.length === 0) return [];

    const reactionMap = new Map();

    const reactions = await reactionRepository
        .checkIfUserReactedList(userId, comments?.map((comment) => comment?.id!), "COMMENT");

    reactions.forEach((reaction) => {
        reactionMap.set(reaction.targetId, reaction.reactionType);
    });

    return comments.map(comment => ({ ...comment, liked: reactionMap.get(comment.id) === "LIKE" }));

};

const getCommentReplies = async (userId: string, commentId: string) => {

    const replies = await commentRepository.find({ parentId: commentId });

    if (!replies) throw NotFound("Comments not found");

    if (replies.length === 0) return [];

    const reactionMap = new Map();

    const reactions = await reactionRepository
        .checkIfUserReactedList(userId, replies?.map((comment) => comment?.id!), "COMMENT");

    reactions.forEach((reaction) => {
        reactionMap.set(reaction.targetId, reaction.reactionType);
    });

    return replies.map(comment => ({ ...comment, liked: reactionMap.get(comment.id) === "LIKE" }));

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