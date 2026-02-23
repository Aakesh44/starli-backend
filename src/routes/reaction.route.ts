import { Router } from "express";

const reactionRouter = Router({
    mergeParams: true
});

reactionRouter.post('/', () => { });
reactionRouter.delete('/', () => { });

export default reactionRouter;