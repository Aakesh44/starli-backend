import { Reaction } from "../models/reaction.model.js";

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

const reactionRepository = { checkIfUserReacted, checkIfUserReactedList };

export default reactionRepository;