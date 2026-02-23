import { Router } from "express";

const scheduledPostRouter = Router();

scheduledPostRouter.get('/', () => { });
scheduledPostRouter.get('/:id', () => { });
scheduledPostRouter.post('/', () => { });
scheduledPostRouter.patch('/:id', () => { });
scheduledPostRouter.delete('/:id', () => { });

export default scheduledPostRouter;