import { Router } from "express";
import { validateRequest } from "../middleware/req.validator.js";
import bookmarkSchema from "../schema/bookmark.request.schema.js";
import bookmarkController from "../controllers/bookmark.controller.js";

const bookmarkRouter = Router({
    mergeParams: true
});

bookmarkRouter.get('/', validateRequest(bookmarkSchema.getBookmarksSchema), bookmarkController.getBookmarks);
bookmarkRouter.post('/', validateRequest(bookmarkSchema.createBookmarkSchema), bookmarkController.createBookmark);
bookmarkRouter.delete('/:postId', validateRequest(bookmarkSchema.deleteBookmarkSchema), bookmarkController.deleteBookmark);

export default bookmarkRouter;