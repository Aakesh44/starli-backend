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

export default { create, unfollow }