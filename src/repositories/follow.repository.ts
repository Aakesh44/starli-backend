import { Types } from "mongoose";
import Follow from "../models/follow.model.js"
import { decodeCursor, encodeCursor } from "./utils/cursor.util.js";
import { mapUserResponse } from "./utils/mappers/user.mapper.js";

const create = async (follower: string, followingId: string) => {

    const existingFollow = await Follow.findOne({
        follower: follower,
        following: followingId
    });

    if (existingFollow) return null;

    return await Follow.create({
        follower: follower,
        following: followingId
    });
}

const unfollow = async (follower: string, followingId: string) => {
    await Follow.deleteOne({
        follower: follower,
        following: followingId
    });
}

const getFollowingStatusBulk = async (userId: string, targetUserIds: string[]) => {

    if (targetUserIds.length === 0) return [];

    const results = await Follow.find({
        follower: userId,
        following: { $in: targetUserIds }
    })
        .select("following")
        .lean();

    return results.map(result => result.following.toString());

};

const getFollowerStatusBulk = async (userId: string, targetUserIds: string[]) => {

    if (targetUserIds.length === 0) return [];

    const results = await Follow.find({
        following: userId,
        follower: { $in: targetUserIds }
    })
        .select("follower")
        .lean();

    return results.map(result => result.follower.toString());

};

const checkIsFollowing = async (userId: string, targetUserId: string) => {

    const user = await Follow.findOne({ follower: userId, following: targetUserId });

    return !!user;
};

const getFollowers = async (userId: string) => {
    const results = await Follow.find({ following: userId })
        .select("follower")
        .populate("follower")
        .lean();

    return results.map(result => mapUserResponse(result.follower as any));
};

const getFollowings = async (userId: string) => {
    const results = await Follow.find({ follower: userId })
        .select("following")
        .populate("following")
        .lean();

    return results.map(result => mapUserResponse(result.following as any));
};

const getFollowsPagination = async ({ conditions, sort, cursor, limit }: {
    conditions: Record<string, any>,
    sort: Record<string, any>,
    cursor: string | undefined,
    limit: number
}) => {

    const queryConditions: Record<string, any> = { ...conditions };

    if (cursor) {
        const { createdAt, id } = decodeCursor(cursor);
        queryConditions.$or = [
            { createdAt: { $lt: new Date(createdAt) } },
            { createdAt: new Date(createdAt), _id: { $lt: new Types.ObjectId(id) } }
        ];
    };

    console.log(' 🔥 queryConditions:', queryConditions);

    const results = await Follow.find(queryConditions)
        .sort(sort)
        .limit(limit + 1)
        .populate("follower following")
        .lean();

    console.log(' 🔥 results:', results);

    const hasMore = results.length === limit + 1;

    const items = hasMore ? results.slice(0, limit) : results;

    console.log(' 🔥 items:', items);

    return {
        items: items.map(result => {
            const user = conditions.following ? result.follower : result.following;
            console.log(' 🔥 user:', user);
            return mapUserResponse(user as any);
        }).filter(Boolean),
        cursor: hasMore ? encodeCursor(items[items.length - 1] as any) : undefined,
        hasMore
    };
};


export default {
    create,
    unfollow,
    checkIsFollowing,
    getFollowingStatusBulk,
    getFollowerStatusBulk,
    getFollowers,
    getFollowings,
    getFollowsPagination
};