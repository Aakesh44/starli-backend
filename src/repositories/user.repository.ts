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

const googleLogin = async (filter: object, update: object) => {
    return await User.findOneAndUpdate(filter, update, { upsert: true, new: true, setDefaultsOnInsert: true }).lean();
}

const userRepository = {
    createUser,
    getUser,
    getUserById,
    googleLogin
};

export default userRepository