import { default as authRouter } from "./auth.route.js";
import { default as postRouter } from "./post.route.js";
import { default as commentRouter } from "./comment.routes.js";
import { default as reshareRouter } from "./reshare.route.js";
import { default as bookmarkRouter } from "./bookmark.route.js";
import { default as reactionRouter } from "./reaction.route.js";
import { default as draftRouter } from "./draft.route.js";
import { default as scheduledPostRouter } from "./scheduled.route.js";
import { default as followRouter } from "./follow.route.js";
import { default as userRouter } from "./user.route.js";
import type { Express } from "express";

import { authenticate } from "../middleware/auth.middleware.js";

export const registerRoutes = (app: Express) => {
    app.use("/api/auth", authRouter);
    app.use("/api/user", authenticate, userRouter);
    app.use("/api/post", authenticate, postRouter);
    app.use("/api/follow", authenticate, followRouter);
    app.use("/api/comment", authenticate, commentRouter);
};