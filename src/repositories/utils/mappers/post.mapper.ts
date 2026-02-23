import type { IPost } from '../../../models/post.model.js';

// utils/mappers/post.mapper.ts
export const mapPostResponse = (post: IPost) => ({
    id: post._id.toString(),
    title: post.title,
    content: post.content,
    tag: post.tag,
    status: post.status,
    author: post.author,
    media: post.media,
    counts: post.counts,
    isReshare: post.isReshare,
    createdAt: post.createdAt,
    updatedAt: post.updatedAt,
    scheduledAt: post.scheduledAt
});
