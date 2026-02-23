import { Router } from "express";

const commentRouter = Router({
    mergeParams: true
});

commentRouter.get('/', () => { });
commentRouter.post('/', () => { });
commentRouter.post('/:id/replies', () => { });
commentRouter.delete('/:id', () => { });

export default commentRouter;