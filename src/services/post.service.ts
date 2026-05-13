import bookmarkRepository from "../repositories/bookmark.repository.js";
import followRepository from "../repositories/follow.repository.js";
import postRepository from "../repositories/post.repository.js";
import reactionRepository from "../repositories/reaction.repository.js";
import userRepository from "../repositories/user.repository.js";
import { mapUserResponse } from "../repositories/utils/mappers/user.mapper.js";
import type { IMedia } from "../schemas/media.schema.js";
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

    const posts = await postRepository.getPosts({
        conditions,
        cursor,
        limit,
        sort
    });

    const userIds = posts.items?.map(post => post.author)
        .filter((u: any) => u && u.id !== userId)
        .map(u => String(u.id)) || [];

    const followingList = await followRepository.getFollowingStatusBulk(userId, userIds);
    const followerList = await followRepository.getFollowerStatusBulk(userId, userIds);

    const followingSet = new Set(followingList);
    const followerSet = new Set(followerList);

    const reactionMap = new Map();

    const reactions = await reactionRepository
        .checkIfUserReactedList(userId, posts.items.map((post) => post.id), "POST");

    reactions.forEach((reaction) => {
        reactionMap.set(reaction.targetId, reaction.reactionType);
    });

    const bookmarkMap = new Map();

    const bookmarks = await bookmarkRepository
        .checkIfUserBookmarkedList({
            userId,
            targetIds: posts.items.map((post) => post.id),
            targetType: 'POST'
        });

    bookmarks.forEach((bookmark) => {
        bookmarkMap.set(String(bookmark.targetId), true);
    });

    return {
        items: posts.items?.map(post => ({
            ...post,
            author: {
                ...post.author,
                following: followingSet.has(String(post.author.id)),
                follower: followerSet.has(String(post.author.id))
            },
            isMine: String(post.author.id) === userId,
            liked: reactionMap.get(post.id) === "LIKE",
            bookmarked: !!bookmarkMap.has(String(post.id))
        })),
        nextCursor: posts.nextCursor,
        hasMore: posts.hasMore
    };

};

const getPostById = async (postId: string, userId: string) => {

    const post = await postRepository.getPostById(postId);
    const reaction = await reactionRepository.checkIfUserReacted(userId, postId, "POST");
    const bookmark = await bookmarkRepository.checkIfUserBookmarked({ userId, targetId: postId, targetType: "POST" });

    const isFollowing = await followRepository.checkIsFollowing(userId, String(post.author._id));
    const isFollower = await followRepository.checkIsFollowing(String(post.author._id), userId);


    return {
        ...post,
        author: {
            ...mapUserResponse(post.author as any),
            following: isFollowing,
            follower: isFollower
        },
        isMine: String(post.author._id) === userId,
        liked: reaction === "LIKE",
        bookmarked: !!bookmark
    };
}

const create = async (data: {
    userId: string,
    title: string,
    content: string,
    status: "PUBLISHED" | "DRAFT" | "SCHEDULED",
    scheduledAt?: Date,
    media: IMedia[],
    tag: string
}) => {

    console.log('data:', data);

    const { userId, title, content, status, scheduledAt, media, tag } = data;

    const user = await userRepository.getUserById(userId);

    if (!user) throw BadRequest("User does not exist");

    if (status === "SCHEDULED" && !scheduledAt) throw BadRequest("Scheduled time is required");

    const post = (await postRepository.createPost({ author: userId, title, content, status, media, scheduledAt: scheduledAt || null, tag }));

    const isFollowing = await followRepository.checkIsFollowing(userId, String(post.author._id));
    const isFollower = await followRepository.checkIsFollowing(String(post.author._id), userId);

    return {
        ...post,
        author: {
            ...mapUserResponse(post.author as any),
            following: isFollowing,
            follower: isFollower
        },
        isMine: String(post.author._id) === userId,
        liked: false,
        bookmarked: false
    };
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

    const isFollowing = await followRepository.checkIsFollowing(userId, String(post.author._id));
    const isFollower = await followRepository.checkIsFollowing(String(post.author._id), userId);

    const reaction = await reactionRepository.checkIfUserReacted(userId, postId, "POST");

    return {
        ...post,
        author: {
            ...mapUserResponse(post.author as any),
            following: isFollowing,
            follower: isFollower
        },
        isMine: String(post.author._id) === userId,
        liked: reaction === "LIKE",
        bookmarked: false
    };
};

const getPostLikes = async (postId: string, userId: string) => {

    const users = await reactionRepository.getReactions(postId, "POST", "LIKE");

    const userIds = users
        .filter(u => u && u.id !== userId)
        .map(u => u.id);

    const followingList = await followRepository.getFollowingStatusBulk(userId, userIds);
    const followerList = await followRepository.getFollowerStatusBulk(userId, userIds);

    const followingSet = new Set(followingList);
    const followerSet = new Set(followerList);

    return users.map((user) => {

        if (!user || user?.id === userId) return user;

        const following = followingSet.has(user.id);
        const follower = followerSet.has(user.id);
        return { ...user, following, follower }

    });

};

const getLikedPosts = async (userId: string, cursor: string, limit: number) => {

    const conditions: Record<string, any> = {
        user: userId
    };

    const sort = {
        createdAt: -1
    };

    const reactions = await reactionRepository.getLikedReactions({ conditions, sort, cursor, limit });
    const postIds = reactions.items.map(r => String(r.targetId));

    const posts = await postRepository.getPostByIds(postIds);

    return {
        items: posts.map(p => ({ ...p, liked: true })),
        nextCursor: reactions.nextCursor,
        hasMore: reactions.hasMore
    };
}

const likeToPost = async (data: {
    postId: string,
    userId: string,
}) => {
    const { postId, userId } = data;

    const post = await postRepository.likeToPost({
        postId,
        userId,
        reactionType: "LIKE"
    });

    return post;
};

const removeLikeFromPost = async (data: {
    postId: string,
    userId: string,
}) => {
    const { postId, userId } = data;

    const post = await postRepository.removeLikeFromPost({
        postId,
        userId
    });

    return post;
};

const deletePost = async (postId: string, userId: string,) => {

    return await postRepository.deletePost(postId, userId);
}

const postService = {
    get,
    getPostById,
    create,
    update,
    getPostLikes,
    getLikedPosts,
    likeToPost,
    removeLikeFromPost,
    deletePost
}

export default postService