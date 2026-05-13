import followRepository from "../repositories/follow.repository.js";
import postRepository from "../repositories/post.repository.js";
import userRepository from "../repositories/user.repository.js";
import { mapUserResponse } from "../repositories/utils/mappers/user.mapper.js";
import type { IMedia } from "../schemas/media.schema.js";


const getProfileById = async (userId: string) => {

    const user = await userRepository.getUserById(userId);

    const [followings, followers] = await Promise.all([
        followRepository.getFollowings(userId),
        followRepository.getFollowers(userId)
    ]);

    const posts = await postRepository.getUserPostsTotal(userId);

    return {
        ...mapUserResponse(user as any),
        followings,
        followers,
        posts
    };
}

const getProfileByUsername = async (username: string) => {

    const user = await userRepository.getUserByUsername(username);

    if (!user) return null;

    console.log('user:', user);

    const [followings, followers] = await Promise.all([
        followRepository.getFollowings(user?._id),
        followRepository.getFollowers(user?._id)
    ]);

    const posts = await postRepository.getUserPostsTotal(user?._id);

    return {
        ...mapUserResponse(user as any),
        followings,
        followers,
        posts
    }
}

const checkUsernameAvailability = async (userId: string, username: string) => {

    const me = await userRepository.getUserById(userId);

    if (me?.username === username) return { available: true };

    const user = await userRepository.getUserByUsername(username);

    return { available: !user };

}

const updateProfile = async (userId: string, data: any) => {

    const user = await userRepository.updateUser(userId, data);

    return mapUserResponse(user as any);

};

const updateProfilePicture = async (userId: string, media: IMedia) => {


    const user = await userRepository.updateUser(userId, {
        picture: media
    });

    return user?.picture;

};

const removeProfilePicture = async (userId: string) => {

    const user = await userRepository.updateUser(userId, { picture: null });

    return user?.picture;
}

const updateProfileCoverImage = async (userId: string, media: IMedia) => {

    const user = await userRepository.updateUser(userId, {
        cover_picture: media
    });

    return user?.cover_picture;

};

const userService = {
    getProfileById,
    getProfileByUsername,
    checkUsernameAvailability,
    updateProfile,
    removeProfilePicture,
    updateProfilePicture,
    updateProfileCoverImage
};

export default userService