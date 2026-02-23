import { Router } from "express";
import {
    draftRouter,
    scheduledPostRouter,
    commentRouter,
    reactionRouter,
    reshareRouter,
    bookmarkRouter
} from './index.js'
import { uploadPostMedia } from "../middleware/upload.middleware.js";
import { validateRequest } from "../middleware/req.validator.js";
import postRequestSchema from "../schema/post.request.schema.js";
import postController from "../controllers/post.controller.js";

const postRouter = Router();

postRouter.get(
    '/',
    validateRequest(postRequestSchema.getPostsSchema),
    postController.get
);
// postRouter.get('/:id',);

postRouter.post(
    '/',
    uploadPostMedia.array('media', 4),
    validateRequest(postRequestSchema.createPostSchema),
    postController.create
);

postRouter.put(
    '/:id',
    uploadPostMedia.array('media', 4),
    validateRequest(postRequestSchema.updatePostSchema),
    postController.update
);

postRouter.delete(
    '/:id',
    validateRequest(postRequestSchema.deletePostSchema),
    postController.deletePost
);

// postRouter.patch('/:id',);

// postRouter.use('/draft', draftRouter);

// postRouter.use('/:postId/comments', commentRouter);
// postRouter.use('/:postId/reactions', reactionRouter);
// postRouter.use('/:postId/reshares', reshareRouter);
// postRouter.use('/:postId/bookmarks', bookmarkRouter);

export default postRouter; 