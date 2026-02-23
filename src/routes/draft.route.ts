import { Router } from "express";

const draftRouter = Router();

draftRouter.get('/', () => { });
draftRouter.get('/:id', () => { });
draftRouter.post('/', () => { });
draftRouter.patch('/:id', () => { });
draftRouter.delete('/:id', () => { });

export default draftRouter;