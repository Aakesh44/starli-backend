import { User } from "../models/user.model.js"

const createUser = async (data: object) => {
    return await User.create(data);
}

const getUser = async (email: string) => {
    return await User.findOne({ email })
}

const getUserById = async (id: string) => {
    return await User.findById(id);
}

const getUserByUsername = async (username: string) => {
    return await User.findOne({ username })
}

const getUserByGoogleSub = async (googleSub: string) => {
    console.log(' 🔥 googleSub:', googleSub);
    return await User.findOne({ googleSub })
}

const getFollowedUserIds = async (userId: string) => {
    const user = await User.findById(userId).lean();
    return user;
}

const googleLogin = async (filter: object, update: object) => {
    console.log('filter:', filter);
    console.log('update:', update);
    return await User.findOneAndUpdate(filter, update, { upsert: true, new: true, setDefaultsOnInsert: true }).lean();
}

const updateUser = async (userId: string, data: object) => {

    const user = await User.findOneAndUpdate({ _id: userId }, data, { new: true });

    console.log('user:', user);

    return user;

}

const userRepository = {
    createUser,
    getUser,
    getUserById,
    getUserByUsername,
    getUserByGoogleSub,
    getFollowedUserIds,
    googleLogin,
    updateUser
};

export default userRepository