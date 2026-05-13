import { Types } from "mongoose";
import { Bookmark } from "../models/bookmark.model.js";
import { decodeCursor, encodeCursor } from "./utils/cursor.util.js";

const getBookmarks = async ({
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

    const bookmarks = await Bookmark.find(queryCondtions)
        .select("-__v")
        .sort(sort)
        .limit(limit + 1) // +1 for cursor
        .lean();

    const hasMore = bookmarks.length === limit + 1;
    const items = (hasMore ? bookmarks.slice(0, limit) : bookmarks);

    const nextCursor = hasMore
        ? encodeCursor(items[items.length - 1] as any)
        : null;

    return { items, nextCursor, hasMore };

};

const checkIfUserBookmarked = async ({
    userId,
    targetId,
    targetType
}: {
    userId: string,
    targetId: string,
    targetType: string
}) => {
    return await Bookmark.findOne({ user: userId, targetId, targetType }).lean();
};

const checkIfUserBookmarkedList = async ({
    userId,
    targetIds,
    targetType
}: {
    userId: string,
    targetIds: string[],
    targetType: string
}) => {
    return await Bookmark.find({ user: userId, targetId: { $in: targetIds }, targetType }).lean();
}

const createBookmark = async ({
    userId,
    targetId,
    targetType
}: {
    userId: string,
    targetId: string,
    targetType: string
}) => {
    return await Bookmark.create({ user: userId, targetId, targetType });
};

const deleteBookmark = async ({ postId, userId }: {
    postId: string,
    userId: string
}) => {
    return await Bookmark.findOneAndDelete({ targetId: postId, user: userId }).lean();
};

const bookmarkRepository = {
    getBookmarks,
    createBookmark,
    checkIfUserBookmarked,
    checkIfUserBookmarkedList,
    deleteBookmark
};

export default bookmarkRepository;