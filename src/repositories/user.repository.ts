import { Types } from "mongoose";
import { User } from "../models/user.model.js"
import { decodeCursor, encodeCursor } from "./utils/cursor.util.js";
import { mapUserResponse } from "./utils/mappers/user.mapper.js";

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

const getUsers = async ({
    conditions, sort, cursor, limit
}: {
    conditions: Record<string, any>;
    sort: Record<string, 1 | -1>;
    cursor?: string;
    limit: number;
}) => {

    const queryConditions = { ...conditions };

    if (cursor) {
        const { createdAt, id } = decodeCursor(cursor);

        queryConditions.$or = [
            { createdAt: { $lt: new Date(createdAt) } },
            { createdAt: new Date(createdAt), _id: { $lt: new Types.ObjectId(id) } }
        ]
    }

    const users = await User.find(queryConditions)
        .sort(sort)
        .limit(limit + 1)
        .lean();

    const hasMore = users.length === limit + 1;

    const items = hasMore ? users.slice(0, limit) : users;

    return {
        items: items.map(u => mapUserResponse(u as any)),
        hasMore,
        nextCursor: hasMore ? encodeCursor(users[users.length - 1] as any) : null
    }
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
    getUsers,
    getFollowedUserIds,
    googleLogin,
    updateUser
};

export default userRepository