import type { IComment } from "../../../models/comment.model.js";

export const mapCommentResponse = (comment: IComment) => (comment ? {
    id: comment._id.toString(),
    author: comment.author,
    targetId: comment.targetId,
    targetType: comment.targetType,
    parentId: comment.parentId,
    content: comment.content,
    media: comment.media,
    counts: comment.counts,
    createdAt: comment.createdAt,
    updatedAt: comment.updatedAt,
} : null);