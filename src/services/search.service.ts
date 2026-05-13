import bookmarkRepository from "../repositories/bookmark.repository.js";
import followRepository from "../repositories/follow.repository.js";
import postRepository from "../repositories/post.repository.js";
import reactionRepository from "../repositories/reaction.repository.js";
import userRepository from "../repositories/user.repository.js";

const search = async ({
    userId, q = "", type, cursor, limit
}: {
    userId: string;
    q: string;
    type: "post" | "user";
    cursor: string;
    limit: number;
}) => {

    const conditions: Record<string, any> = {};

    if (type === "post") {
        conditions.status = "PUBLISHED";
        conditions.title = { $regex: q, $options: "i" };
        conditions.content = { $regex: q, $options: "i" };
    } else if (type === "user") {
        conditions.name = { $regex: q, $options: "i" };
        conditions.username = { $regex: q, $options: "i" };
    }

    const sort: Record<string, any> = { createdAt: -1, _id: -1 };

    let items;

    if (type === "post") {
        const posts = await postRepository.getPosts({ conditions, sort, cursor, limit });
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

        items = {
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
            hasMore: posts.hasMore,
            nextCursor: posts.nextCursor,
            type: "post"
        }
    }
    else if (type === "user") {
        const users = await userRepository.getUsers({ conditions, sort, cursor, limit });
        const userIds = users.items
            .filter(u => u && u.id !== userId)
            .map(u => u.id);

        const followingList = await followRepository.getFollowingStatusBulk(userId, userIds);
        const followerList = await followRepository.getFollowerStatusBulk(userId, userIds);

        const followingSet = new Set(followingList);
        const followerSet = new Set(followerList);

        return {
            items: users.items?.map((user) => {

                if (!user || user?.id === userId) return user;

                const following = followingSet.has(user.id);
                const follower = followerSet.has(user.id);
                return { ...user, following, follower }

            }),
            hasMore: users.hasMore,
            nextCursor: users.nextCursor,
            type: "user"
        }
    }

    if (!items) {
        return {
            items: [],
            type,
            nextCursor: null,
            hasMore: false
        };
    }

    return {
        items: items.items || [],
        type,
        nextCursor: items.hasMore ? items.nextCursor : null,
        hasMore: items.hasMore
    };

};

const searchService = {
    search
};

export default searchService;