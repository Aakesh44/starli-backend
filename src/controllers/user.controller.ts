import type { Response, NextFunction } from "express";
import userService from "../services/user.service.js";
import type { AuthenticatedRequest } from "../middleware/auth.middleware.js";
import uploadService from "../services/upload.service.js";

const ALLOWED_FILE_TYPES = ["image/jpeg", "image/jpg", "image/png", "image/webp"];

const getProfile = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    try {

        const userId = req.user!.userId;

        const data = await userService.getProfileById(userId);

        return res.status(200).json({ success: true, data, message: "Profile fetched successfully" });

    }
    catch (error) {
        next(error);
    }
};

const getUserProfileById = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    try {

        const userId = req.validated?.params.userId;

        const data = await userService.getProfileById(userId);

        return res.status(200).json({ success: true, data, message: "Profile fetched successfully" });

    } catch (error) {
        next(error);
    }
}

const getUserProfileByUsername = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    try {

        const username = req.validated?.params.username;

        const data = await userService.getProfileByUsername(username);

        return res.status(200).json({ success: true, data, message: "Profile fetched successfully" });

    } catch (error) {
        next(error);
    }
}

const checkUsernameAvailability = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    try {

        const userId = req.user!.userId;
        const username = req.validated?.params.username;

        const data = await userService.checkUsernameAvailability(userId, username);

        return res.status(200).json({ success: true, data, message: "Username availability checked successfully" });

    } catch (error) {
        next(error);
    }
}

const updateProfile = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    try {

        const userId = req.user!.userId;

        const data = await userService.updateProfile(userId, req.body);

        return res.status(200).json({ success: true, data, message: "Profile updated successfully" });

    }
    catch (error) {
        next(error);
    }
};

const updateProfilePicture = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    try {

        const userId = req.user!.userId;;

        const file = req?.file;

        if (!file) return res.status(400).json({ success: false, message: "File is required" });

        const uploadedFile = await uploadService.uploadCloudinary(file, 'PROFILE_PICTURE');

        const uploadedPicture = {
            url: uploadedFile?.secure_url,
            publicId: uploadedFile?.public_id,
            type: uploadedFile?.resource_type?.toUpperCase()
        };

        const user = await userService.getProfileById(userId);

        if (user?.picture?.publicId) {
            await uploadService.deleteCloudinary(user.picture.publicId);
        }

        const profile_picture = await userService.updateProfilePicture(userId, uploadedPicture);

        return res.status(200).json({ success: true, profile_picture, message: "Profile image updated successfully" });

    }
    catch (error) {
        next(error);
    }
};

const removeProfilePicture = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    try {

        const userId = req.user!.userId;

        const user = await userService.getProfileById(userId);

        if (user?.picture?.publicId) {
            await uploadService.deleteCloudinary(user.picture.publicId);
        }

        await userService.removeProfilePicture(userId);

        return res.status(200).json({ success: true, message: "Profile image removed successfully" });

    } catch (error) {
        next(error);
    }
}

const updateProfileCoverImage = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    try {

        const userId = req.user!.userId;;

        const file = req?.file;

        if (!file) return res.status(400).json({ success: false, message: "File is required" });

        const uploadedFile = await uploadService.uploadCloudinary(file, 'PROFILE_PICTURE');

        const user = await userService.getProfileById(userId);

        if (user?.cover_picture?.publicId) {
            await uploadService.deleteCloudinary(user.cover_picture.publicId);
        }

        const uploadedPicture = {
            url: uploadedFile?.secure_url,
            publicId: uploadedFile?.public_id,
            type: uploadedFile?.resource_type?.toUpperCase()
        }

        const cover_picture = await userService.updateProfileCoverImage(userId, uploadedPicture);

        return res.status(200).json({ success: true, cover_picture, message: "Profile cover image updated successfully" });

    } catch (error) {
        next(error);
    }
}

const userController = {
    getProfile,
    getUserProfileById,
    getUserProfileByUsername,
    checkUsernameAvailability,
    updateProfile,
    updateProfilePicture,
    removeProfilePicture,
    updateProfileCoverImage
};

export default userController;