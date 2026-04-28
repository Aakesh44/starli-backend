import { Router } from "express";
import { validateRequest } from "../middleware/req.validator.js";
import commentSchema from "../schema/comment.request.schema.js";
import commentRequestSchema from "../schema/comment.request.schema.js";
import { uploadPostMedia } from "../middleware/upload.middleware.js";
import commentController from "../controllers/comment.controller.js";

const commentRouter = Router({
    mergeParams: true
});

commentRouter.post('/', uploadPostMedia.single('file'), validateRequest(commentRequestSchema.createPostSchema), commentController.create);
commentRouter.get('/', validateRequest(commentSchema.getCommentsSchema), commentController.getComments);
commentRouter.get('/:commentId/replies', validateRequest(commentRequestSchema.getCommentRepliesSchema), commentController.getCommentReplies);
commentRouter.put('/:commentId', validateRequest(commentRequestSchema.updateCommentSchema), commentController.updateComment);
commentRouter.delete('/:commentId', validateRequest(commentRequestSchema.deleteCommentSchema), commentController.deleteComment);

export default commentRouter;