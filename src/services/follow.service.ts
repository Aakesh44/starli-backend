import { BadRequest } from "../utils/errors.js";
import followRepository from "../repositories/follow.repository.js";

const getFollwing = async (userId: string) => { };

const getFollowers = async (userId: string) => { };

const follow = async (userId: string, followingId: string) => {
    if (userId === followingId) throw BadRequest("You cannot follow yourself");

    await followRepository.create(userId, followingId);
};

const unfollow = async (userId: string, followingId: string) => {

    await followRepository.unfollow(userId, followingId);

};

export default { getFollwing, getFollowers, follow, unfollow };