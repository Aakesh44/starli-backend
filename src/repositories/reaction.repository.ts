import { Reaction } from "../models/reaction.model.js";
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

const reactionRepository = { checkIfUserReacted, checkIfUserReactedList, getReactions };

export default reactionRepository;