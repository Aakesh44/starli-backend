import { Router } from "express";
import { validateRequest } from "../middleware/req.validator.js";
import searchSchema from "../schema/search.request.schema.js";
import searchController from "../controllers/search.controller.js";

const router = Router();

router.get('/', validateRequest(searchSchema), searchController.search);

export default router;