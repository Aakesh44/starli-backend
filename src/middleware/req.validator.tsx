import { ZodObject } from "zod";
import type { Request, Response, NextFunction } from 'express';

export const validateRequest =
    (schema: ZodObject<any>) =>
        (req: Request, res: Response, next: NextFunction) => {

            const result = schema.safeParse({
                body: req.body,
                query: req.query,
                params: req.params
            });

            if (!result.success) {
                const errors = result.error.issues.map(i => ({
                    field: i.path.join("."),
                    message: i.message
                }));

                return res.status(400).json({ success: false, errors });
            }

            req.validated = result.data;

            next();
        }
