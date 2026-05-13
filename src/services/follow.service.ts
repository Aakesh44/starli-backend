import { BadRequest } from "../utils/errors.js";
import followRepository from "../repositories/follow.repository.js";

const getFollow = async ({ userId, type, cursor, limit = 10 }: {
    userId: string,
    type: 'followers' | 'following',
    cursor?: string,
    limit?: number
}) => {

    const conditions: Record<string, any> = {};
    if (type === 'followers') {
        conditions.following = userId;
    } else {
        conditions.follower = userId;
    };

    const sort: Record<string, any> = { createdAt: -1, _id: -1 };

    console.log(' 🔥 conditions:', conditions);

    const users = await followRepository.getFollowsPagination({ conditions, sort, cursor, limit });

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
        nextCursor: users.hasMore ? users.cursor : null,
    };

};

const follow = async (userId: string, followingId: string) => {

    if (userId === followingId) throw BadRequest("You cannot follow yourself");

    const follow = await followRepository.create(userId, followingId);

    if (!follow) throw BadRequest("You are already following this user");

};

const unfollow = async (userId: string, followingId: string) => {

    if (userId === followingId) throw BadRequest("You cannot unfollow yourself");

    await followRepository.unfollow(userId, followingId);

};

export default { getFollow, follow, unfollow };