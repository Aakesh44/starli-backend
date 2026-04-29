import Follow from "../models/follow.model.js"

const create = async (follower: string, followingId: string) => {
    await Follow.create({
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
}


export default { create, unfollow, checkIsFollowing, getFollowingStatusBulk, getFollowerStatusBulk };