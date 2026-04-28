import type { CommentTargetType } from "../models/comment.model.js";
import { Post } from "../models/post.model.js";
import commentRepository from "../repositories/comment.repository.js";
import postRepository from "../repositories/post.repository.js";
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
    }


    return comment;

};

const getComments = async (targetId: string, targetType: CommentTargetType) => {

    const comments = await commentRepository.find({ targetId, targetType, parentId: null });

    return comments;

};

const getCommentReplies = async (commentId: string) => {

    const replies = await commentRepository.find({ parentId: commentId });

    return replies;
};

const updateComment = async (commentId: string, content: string) => {
    const comment = await commentRepository.update(commentId, { content });

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
    deleteComment
}

export default commentService