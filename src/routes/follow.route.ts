import { Router } from "express";
import followController from "../controllers/follow.controller.js";
import { validateRequest } from "../middleware/req.validator.js";
import followRequestSchema from "../schema/follow.request.schema.js";

const followRouter = Router();

followRouter.get('/', followController.get);
followRouter.post('/', validateRequest(followRequestSchema.createFollowRequestSchema), followController.create);
followRouter.delete('/', validateRequest(followRequestSchema.deleteFollowRequestSchema), followController.deleteFollow);

export default followRouter;