import { Comment } from "../models/comment.model.js";
import { Post } from "../models/post.model.js";
import { Reaction } from "../models/reaction.model.js";
import { mapCommentResponse } from "./utils/mappers/comment.mapper.js";

const updateCounterToComment = async (commentId: string, counterField: "likes" | "replies", value: number) => {
    await Comment.findByIdAndUpdate(commentId, { $inc: { [`counts.${counterField}`]: value } });
};

const create = async (data: object) => {
    const comment = await (await Comment.create(data)).populate("author");
    const { targetId, targetType } = data as any;

    if (targetType === "POST" && targetId) {
        await Post.findByIdAndUpdate(targetId, { $inc: { "counts.comments": 1 } });
    }

    // return comment;
    return mapCommentResponse(comment as any);
};

const find = async (data: object) => {
    const comments = await Comment
        .find(data)
        .select("-__v -deletedAt")
        // sort based on counts: {likes}
        .sort({ "counts.likes": -1, "counts.replies": -1 })
        .lean().populate("author");
    return comments.map(c => mapCommentResponse(c as any));
};

const findOne = async (data: object) => {
    const comment = await Comment.findOne(data);
    return mapCommentResponse(comment as any);
};

const update = async (id: string, data: object) => {
    const comment = await Comment.findOneAndUpdate({ _id: id }, data, { new: true });
    return mapCommentResponse(comment as any);
};

const likeToComment = async (commentId: string, userId: string) => {

    const comment = await Reaction.findOne(
        { user: userId, targetId: commentId, targetType: "COMMENT" }
    );

    if (comment) {
        await Reaction.findOneAndDelete({ user: userId, targetId: commentId, targetType: "COMMENT" });

        await updateCounterToComment(commentId, "likes", -1);
    }
    else {
        await Reaction.create({ user: userId, targetId: commentId, targetType: "COMMENT", reactionType: "LIKE" });

        await updateCounterToComment(commentId, "likes", 1);
    }
};

const removeLikeFromComment = async (commentId: string, userId: string) => {

    const reaction = await Reaction.findOneAndDelete({ user: userId, targetId: commentId, targetType: "COMMENT", reactionType: "LIKE" });

    if (reaction) {
        await updateCounterToComment(commentId, "likes", -1);
    }
};

const deleteCommentById = async (id: string) => {
    return await Comment.findByIdAndUpdate({ _id: id }, { isDeleted: true });
};

const deleteCommentByTargetId = async (targetId: string) => {

    // soft delete all comments by target id
    return await Comment.updateMany({ targetId }, { isDeleted: true });
};

const commentRepository = {
    create,
    find,
    findOne,
    update,
    updateCounterToComment,
    likeToComment,
    removeLikeFromComment,
    deleteCommentById,
    deleteCommentByTargetId
};

export default commentRepository;