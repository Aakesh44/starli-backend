import { Types } from "mongoose";
import { Reaction } from "../models/reaction.model.js";
import { decodeCursor, encodeCursor } from "./utils/cursor.util.js";
import { mapUserResponse } from "./utils/mappers/user.mapper.js";

const checkIfUserReacted = async (userId: string, targetId: string, targetType: string) => {
    const reaction = await Reaction.findOne({ user: userId, targetId, targetType });
    // Returns the reaction type if the user has reacted, otherwise returns null
    return reaction ? reaction.reactionType : null;
};

const checkIfUserReactedList = async (userId: string, targetIds: string[], targetType: string) => {
    const reactions = await Reaction.find({ user: userId, targetId: { $in: targetIds }, targetType });
    // Returns the reaction type if the user has reacted, otherwise returns null
    return reactions.map(reaction => ({ targetId: reaction.targetId.toString(), reactionType: reaction.reactionType }));
};

const getReactions = async (targetId: string, targetType: string, reactionType: 'LIKE') => {

    const reactions = await Reaction.find({ targetId: targetId, targetType: targetType, reactionType: reactionType }).lean().populate("user");

    return reactions.map(reaction => mapUserResponse(reaction.user as any));

};

const getLikedReactions = async ({
    conditions,
    sort,
    cursor,
    limit
}: {
    conditions: Record<string, any>,
    sort: Record<string, any>,
    cursor: string,
    limit: number
}) => {

    const queryCondtions = { ...conditions };

    if (cursor) {
        const { createdAt, id } = decodeCursor(cursor);

        queryCondtions.$or = [
            { createdAt: { $lt: new Date(createdAt) } },
            {
                createdAt: new Date(createdAt),
                _id: { $lt: new Types.ObjectId(id) }
            }
        ]
    };

    const reactions = await Reaction.find(queryCondtions)
        .select("-__v")
        .sort(sort)
        .limit(limit + 1) // +1 for cursor
        .lean()

    const hasMore = reactions.length === limit + 1;
    const items = (hasMore ? reactions.slice(0, limit) : reactions);

    const nextCursor = hasMore
        ? encodeCursor(items[items.length - 1] as any)
        : null;

    return { items, nextCursor, hasMore };

}

const reactionRepository = { checkIfUserReacted, checkIfUserReactedList, getReactions, getLikedReactions };

export default reactionRepository;