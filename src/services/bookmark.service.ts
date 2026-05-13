import bookmarkRepository from "../repositories/bookmark.repository.js";
import postRepository from "../repositories/post.repository.js";
import { BadRequest } from "../utils/errors.js";

const getBookmarks = async ({
    userId,
    cursor,
    limit
}: {
    userId: string,
    cursor: string,
    limit: number
}) => {

    const conditions: Record<string, any> = {
        user: userId
    };

    const sort = {
        createdAt: -1
    };

    const bookmarks = await bookmarkRepository.getBookmarks({ conditions, sort, cursor, limit });

    const postIds = bookmarks.items.map(b => String(b.targetId));

    const posts = await postRepository.getPostByIds(postIds);

    return {
        items: posts.map(p => ({ ...p, bookmarked: true })),
        nextCursor: bookmarks.nextCursor,
        hasMore: bookmarks.hasMore
    };
};

const createBookmark = async (payload: {
    userId: string,
    targetId: string,
    targetType: string
}) => {

    const bookmark = await bookmarkRepository.checkIfUserBookmarked(payload);

    if (bookmark) {
        throw BadRequest("ALREADY_BOOKMARKED");
    };

    return await bookmarkRepository.createBookmark(payload);
};

const deleteBookmark = async (payload: {
    userId: string,
    postId: string
}) => {

    const bookmark = await bookmarkRepository.deleteBookmark({ ...payload });

    if (!bookmark) {
        throw BadRequest("BOOKMARK_NOT_FOUND");
    }

    return bookmark;

};

const bookmarkService = {
    getBookmarks,
    createBookmark,
    deleteBookmark
};

export default bookmarkService;