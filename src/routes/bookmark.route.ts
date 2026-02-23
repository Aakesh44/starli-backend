import { Router } from "express";

const bookmarkRouter = Router({
    mergeParams: true
});

bookmarkRouter.post('/', () => { });
bookmarkRouter.delete('/', () => { });

export default bookmarkRouter;