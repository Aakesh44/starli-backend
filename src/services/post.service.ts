import postRepository from "../repositories/post.repository.js";
import userRepository from "../repositories/user.repository.js";
import { BadRequest } from "../utils/errors.js";

const get = async (data: {
    userId: string,
    author: string,
    cursor: string,
    limit: number,
    q: string,
    tag: string,
    filter: "FOLLOWING" | 'TRENDING' | 'DRAFT' | 'SCHEDULED' | "ALL"
}) => {

    const { userId, author, cursor, limit, q, tag, filter } = data;

    const conditions: Record<string, any> = {
        isDeleted: false,
    }

    let sort: any = {
        createdAt: -1,
        _id: -1
    };

    switch (filter) {
        case "ALL": {
            conditions.status = "PUBLISHED";
            if (author) {
                conditions.author = author;
            }
            break;
        }
        case "DRAFT": {
            conditions.status = "DRAFT";
            conditions.author = userId;
            break;
        }
        case "SCHEDULED": {
            conditions.status = "SCHEDULED";
            conditions.author = userId;
            conditions.scheduledAt = { $gt: new Date() };
            break;
        }
        case "FOLLOWING": {
            const followedUserIds = await userRepository.getFollowedUserIds(userId);
            conditions.status = "PUBLISHED";
            conditions.author = { $in: followedUserIds };
            break;
        }
        case "TRENDING": {
            conditions.status = "PUBLISHED";
            sort = {
                "counts.likes": -1,
                "counts.comments": -1,
                "createdAt": -1
            };
            break;
        }

    }

    // Search by query
    if (q) {
        conditions.$or = [
            { title: { $regex: q, $options: "i" } },
            { content: { $regex: q, $options: "i" } },
            { tag: { $regex: q, $options: "i" } },
        ]
    }

    // Tag filter
    if (tag) {
        conditions.tag = tag;
    };

    console.log('conditions:', conditions);

    return await postRepository.getPosts({
        conditions,
        cursor,
        limit,
        sort
    });

}

const create = async (data: {
    userId: string,
    title: string,
    content: string,
    status: "PUBLISHED" | "DRAFT" | "SCHEDULED",
    scheduledAt?: Date,
    media: { url: string, type: "IMAGE" | "VIDEO" }[],
    tag: string
}) => {

    console.log('data:', data);

    const { userId, title, content, status, scheduledAt, media, tag } = data;

    const user = await userRepository.getUserById(userId);

    if (!user) throw BadRequest("User does not exist");

    if (status === "SCHEDULED" && !scheduledAt) throw BadRequest("Scheduled time is required");

    const post = (await postRepository.createPost({ author: userId, title, content, status, media, scheduledAt: scheduledAt || null, tag }));

    return { ...post, author: user };
};

const update = async (data: {
    userId: string,
    postId: string,
    title: string,
    content: string,
    status: "PUBLISHED" | "DRAFT" | "SCHEDULED",
    scheduledAt?: Date,
    media: { url: string, type: "IMAGE" | "VIDEO" }[],
    tag: string
}) => {

    const { userId, postId, title, content, status, scheduledAt, media, tag } = data;

    const user = await userRepository.getUserById(userId);

    if (!user) throw BadRequest("User does not exist");

    if (status === "SCHEDULED" && !scheduledAt) throw BadRequest("Scheduled time is required");

    const post = (await postRepository.updatePosts({ id: postId, author: userId, title, content, status, scheduledAt: scheduledAt || null, media, tag }));

    return { ...post, author: user };
};

const deletePost = async (postId: string, userId: string,) => {

    return await postRepository.deletePost(postId, userId);
}

const postService = {
    get,
    create,
    update,
    deletePost
}

export default postService