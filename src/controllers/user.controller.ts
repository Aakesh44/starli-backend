import type { Response, NextFunction } from "express";
import userService from "../services/user.service.js";
import type { AuthenticatedRequest } from "../middleware/auth.middleware.js";

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

        if (!ALLOWED_FILE_TYPES.includes(file.mimetype)) return res.status(400).json({ success: false, message: "Unsupported file type" });

        const data = await userService.updateProfilePicture(userId, file);

        return res.status(200).json({ success: true, data, message: "Profile image updated successfully" });

    }
    catch (error) {
        next(error);
    }
};

const removeProfilePicture = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    try {

        const userId = req.user!.userId;

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

        if (!ALLOWED_FILE_TYPES.includes(file.mimetype)) return res.status(400).json({ success: false, message: "Unsupported file type" });

        const data = await userService.updateProfileCoverImage(userId, file);

        return res.status(200).json({ success: true, data, message: "Profile cover image updated successfully" });

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