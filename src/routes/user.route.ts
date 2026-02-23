import Router from 'express';
import userController from '../controllers/user.controller.js';
import userRequestSchema from '../schema/user.request.schema.js';
import { validateRequest } from '../middleware/req.validator.js';
import { uploadPostMedia } from '../middleware/upload.middleware.js';
const userRouter = Router();

userRouter.get('/profile', userController.getProfile);
userRouter.get('/id/:userId', validateRequest(userRequestSchema.getUserProfileByIdSchema), userController.getUserProfileById);
userRouter.get('/u/:username', validateRequest(userRequestSchema.getUserProfileByUsername), userController.getUserProfileByUsername);
userRouter.get('/check_username_availability/:username', validateRequest(userRequestSchema.getUserProfileByUsername), userController.checkUsernameAvailability);
userRouter.patch('/profile', validateRequest(userRequestSchema.updateUserProfileScema), userController.updateProfile);
userRouter.patch('/profile_picture', uploadPostMedia.single('file'), userController.updateProfilePicture);
userRouter.patch('/remove_profile_picture', userController.removeProfilePicture);
userRouter.patch('/profile_cover_picture', uploadPostMedia.single('file'), userController.updateProfileCoverImage);
userRouter.delete('/:id', () => { });

export default userRouter;