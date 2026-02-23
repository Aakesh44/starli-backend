import { Router } from "express";
import followController from "../controllers/follow.controller.js";

const followRouter = Router();

followRouter.get('/', followController.get);
followRouter.post('/', followController.create);
followRouter.delete('/:id', followController.deleteFollow);

export default followRouter;