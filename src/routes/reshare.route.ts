import { Router } from 'express';

const reshareRouter = Router({
    mergeParams: true,
});

reshareRouter.post('/', () => { });

export default reshareRouter;