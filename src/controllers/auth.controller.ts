import type { NextFunction, Request, Response } from 'express';
import authService from '../services/auth.service.js'
import { BadRequest } from '../utils/errors.js';

const signup = async (req: Request, res: Response, next: NextFunction) => {
    try {

        const { email, password } = req.body;

        const { otp, token } = await authService.signup(email, password);

        return res.status(201).json({
            success: true,
            otp,
            token,
            message: `Otp has been sent to your email`
        });

    } catch (error) {
        next(error);
    }
}

const login = async (req: Request, res: Response, next: NextFunction) => {

    try {

        const { email, password } = req.body;

        const { user, needsVerification, token, otp, access_token, refresh_token } = await authService.login(email, password);

        if (needsVerification) {
            return res.status(403).json({
                success: false,
                needsVerification: true,
                token: token,
                otp,
                code: "NOT_VERIFIED",
                message: "User is not verified"
            })
        }

        return res.status(200).json({
            success: true,
            user,
            access_token,
            refresh_token,
            message: "Login successful"
        });

    } catch (error) {
        console.log(error);
        next(error)
    }

};

const googleLogin = async (req: Request, res: Response, next: NextFunction) => {
    try {

        const { idToken } = req.body;

        if (!idToken) {
            throw BadRequest("Id token is required");
        }

        const { user, access_token, refresh_token } = await authService.google(idToken);

        return res.status(200).json({
            success: true,
            user: { ...user, image: user.picture },
            access_token,
            refresh_token,
            message: "Login successful"
        });

    } catch (error) {
        next(error);
    }
}

const logout = async (req: Request, res: Response) => {

}

const verifyEmail = async (req: Request, res: Response, next: NextFunction) => {
    try {

        const { token, otp } = req.body;

        const { user, access_token } = await authService.verifyEmail(token, otp);

        return res.status(200).json({
            success: true,
            user,
            access_token,
            message: "Email verified"
        });

    } catch (error) {
        next(error);
    }
};

const validateEmailForReset = async (req: Request, res: Response, next: NextFunction) => {
    try {

        const { email } = req.body;

        const { user, token, otp } = await authService.validateEmailForReset(email);

        return res.status(200).json({
            success: true,
            user,
            token,
            otp,
            message: "Email verified"
        });

    } catch (error) {
        next(error);
    }
};

const validateOtp = async (req: Request, res: Response, next: NextFunction) => {
    try {

        const { token, otp } = req.body;

        await authService.validateOtp(token, otp);

        return res.status(200).json({
            success: true,
            message: "Otp is valid and has been verified"
        });

    } catch (error) {
        next(error);
    }
};

const sendOtp = async (req: Request, res: Response, next: NextFunction) => {
    try {

        const { token } = req.body;

        const { otp } = await authService.sendOtp(token);

        return res.status(200).json({ success: true, message: `Otp has been sent to your email ${otp}` });

    } catch (error) {
        next(error)
    }
}

const resetPassword = async (req: Request, res: Response, next: NextFunction) => {
    try {

        const { token, password } = req.body;

        await authService.resetPassword(token, password);

        return res.status(200).json({ success: true, message: "Password has been reset successfully" });

    } catch (error) {
        next(error)
    }
}

const authController = {
    signup,
    login,
    googleLogin,
    logout,
    verifyEmail,
    validateEmailForReset,
    sendOtp,
    validateOtp,
    resetPassword
}

export default authController