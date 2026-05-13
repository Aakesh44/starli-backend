import { Router } from "express";
import followController from "../controllers/follow.controller.js";
import { validateRequest } from "../middleware/req.validator.js";
import followRequestSchema from "../schema/follow.request.schema.js";

const followRouter = Router({
    mergeParams: true
});

followRouter.get('/', validateRequest(followRequestSchema.getFollowSchema), followController.getFollow);
followRouter.post('/', validateRequest(followRequestSchema.createFollowRequestSchema), followController.create);
followRouter.patch('/', validateRequest(followRequestSchema.deleteFollowRequestSchema), followController.deleteFollow);

export default followRouter;