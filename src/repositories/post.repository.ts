import { Types } from "mongoose";
import { Post } from "../models/post.model.js";
import { decodeCursor, encodeCursor } from "./utils/cursor.util.js";
import { mapPostResponse } from "./utils/mappers/post.mapper.js";
import { mapUserResponse } from "./utils/mappers/user.mapper.js";
import { Reaction } from "../models/reaction.model.js";

interface GetPostsRepoInput {
    conditions: Record<string, any>;
    sort: Record<string, 1 | -1>;
    cursor?: string;
    limit: number;
}

export interface CreatePostInput {
    author: string; // ObjectId as string
    title: string;
    content: string;
    status: "PUBLISHED" | "DRAFT" | "SCHEDULED";
    tag?: string;
    scheduledAt?: Date | null;
    media?: {
        url: string;
        type: "IMAGE" | "VIDEO";
    }[];
};

export interface UpdatePostInput {
    id: string;
    author: string; // ObjectId as string
    title: string;
    content: string;
    status: "PUBLISHED" | "DRAFT" | "SCHEDULED";
    tag?: string;
    scheduledAt?: Date | null;
    media?: {
        url: string;
        type: "IMAGE" | "VIDEO";
    }[];
};

const updateCounterToPost = async (postId: string, counterField: "likes" | "comments" | "dislikes" | "reshares", value: number) => {
    await Post.findByIdAndUpdate(postId, { $inc: { [`counts.${counterField}`]: value } });
};

const getPosts = async ({
    conditions,
    sort,
    cursor,
    limit
}: GetPostsRepoInput) => {

    const queryConditions = { ...conditions };

    if (cursor) {

        const { createdAt, id } = decodeCursor(cursor);

        queryConditions.$or = [
            { createdAt: { $lt: new Date(createdAt) } },
            {
                createdAt: new Date(createdAt),
                _id: { $lt: new Types.ObjectId(id) }
            }
        ];
    };

    const posts = await Post.find(queryConditions)
        .select("-__v -isDeleted -deletedAt")
        .sort(sort)
        .limit(limit + 1) // +1 for cursor
        .lean().populate("author");

    const hasMore = posts.length === limit + 1;
    const items = (hasMore ? posts.slice(0, limit) : posts)?.map(p => ({ ...p, author: mapUserResponse(p.author as any) }))?.filter(Boolean);

    const nextCursor = hasMore
        ? encodeCursor(items[items.length - 1] as any)
        : null;

    return {
        items: items?.map(p => mapPostResponse(p as any)),
        nextCursor,
        hasMore
    }
}

const getPostById = async (id: string) => {

    const post = await Post.findById(id).select("-__v -isDeleted -deletedAt").lean().populate("author");
    return mapPostResponse(post as any);

}

const createPost = async (data: CreatePostInput) => {

    const created = await Post.create(data);

    const post = await Post.findById(created._id).select("-__v -isDeleted -deletedAt").lean();

    return mapPostResponse(post as any);
}

const updatePosts = async (data: UpdatePostInput) => {
    const post = await Post.findOneAndUpdate(
        { _id: data.id },
        data,
        {
            new: true,
            lean: true,
            runValidators: true
        }
    ).select("-__v -isDeleted -deletedAt");

    return mapPostResponse(post as any);
}

const likeToPost = async (data: {
    userId: string,
    postId: string,
    reactionType: "LIKE"
}) => {

    const reaction = await Reaction.findOne(
        { user: data.userId, targetId: data.postId, targetType: "POST" }
    );

    console.log('⚠️ Existing reaction:', reaction);

    if (reaction) {

        await Reaction.findOneAndDelete({ user: data.userId, targetId: data.postId, targetType: "POST" });

        await updateCounterToPost(data.postId, "likes", -1);

    }
    else {
        await Reaction.create({ user: data.userId, targetId: data.postId, targetType: "POST", reactionType: data.reactionType });

        await updateCounterToPost(data.postId, "likes", 1);
    }
};

const removeLikeFromPost = async (data: {
    userId: string,
    postId: string,
}) => {

    const reaction = await Reaction.findOneAndDelete({ user: data.userId, targetId: data.postId, targetType: "POST", reactionType: "LIKE" });

    if (reaction) {
        await updateCounterToPost(data.postId, "likes", -1);
    }
};


const deletePost = async (id: string, author: string) => {
    console.log('id:', id);
    console.log('author:', author);
    const post = await Post.findOneAndUpdate({ _id: id, author }, { isDeleted: true, deletedAt: new Date() });

    return mapPostResponse(post as any);
}

const postRepository = {
    getPosts,
    getPostById,
    createPost,
    updatePosts,
    likeToPost,
    deletePost,
    removeLikeFromPost,
    updateCounterToPost
};

export default postRepository