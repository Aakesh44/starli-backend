import userRepository from "../repositories/user.repository.js";
import { mapUserResponse } from "../repositories/utils/mappers/user.mapper.js";


const getProfileById = async (userId: string) => {

    const user = await userRepository.getUserById(userId);

    return mapUserResponse(user as any);
}

const getProfileByUsername = async (username: string) => {

    const user = await userRepository.getUserByUsername(username);

    console.log('user:', user);

    return mapUserResponse(user as any);
}

const checkUsernameAvailability = async (userId: string, username: string) => {

    const me = await userRepository.getUserById(userId);

    if (me?.username === username) return { available: true };

    const user = await userRepository.getUserByUsername(username);

    return { available: !user };

}

const updateProfile = async (userId: string, data: any) => {

    return await userRepository.updateUser(userId, data);

};

const updateProfilePicture = async (userId: string, data: any) => {

    return {
        url: 'url'
    }

    const user = await userRepository.updateUser(userId, data);

    return mapUserResponse(user as any);

};

const removeProfilePicture = async (userId: string) => {
    await userRepository.updateUser(userId, { picture: null });
}

const updateProfileCoverImage = async (userId: string, data: any) => {

    return {
        url: 'url'
    }

    return await userRepository.updateUser(userId, data);

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