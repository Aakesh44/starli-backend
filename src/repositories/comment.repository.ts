import { Types } from "mongoose";
import { Comment } from "../models/comment.model.js";
import { Post } from "../models/post.model.js";
import { Reaction } from "../models/reaction.model.js";
import { decodeCursor, encodeCursor } from "./utils/cursor.util.js";
import { mapCommentResponse } from "./utils/mappers/comment.mapper.js";
import { mapUserResponse } from "./utils/mappers/user.mapper.js";

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

interface GetCommentsRepoInput {
    conditions: Record<string, any>;
    sort: Record<string, 1 | -1>;
    cursor?: string;
    limit: number;
};

const find = async ({
    conditions,
    limit,
    sort,
    cursor
}: GetCommentsRepoInput) => {

    const queryConditions = { ...conditions };

    if (cursor) {
        const { createdAt, id } = decodeCursor(cursor);

        queryConditions.$or = [
            { createdAt: { $lt: new Date(createdAt) } },
            {
                createdAt: new Date(createdAt),
                _id: { $lt: new Types.ObjectId(id) }
            }
        ]
    }

    const comments = await Comment
        .find(queryConditions)
        .select("-__v -deletedAt")
        // sort based on counts: {likes}
        .sort(sort)
        .limit(limit + 1)
        .lean().populate("author");

    const hasMore = comments.length === limit + 1;
    const items = (hasMore ? comments.slice(0, limit) : comments)?.map(c => ({ ...c, author: mapUserResponse(c.author as any) }))?.filter(Boolean);
    const nextCursor = hasMore
        ? encodeCursor(items[items.length - 1] as any)
        : null;

    return {
        items: items?.map(p => mapCommentResponse(p as any)),
        nextCursor,
        hasMore
    }
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