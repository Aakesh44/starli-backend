import { OTP_CONFIG, TOKEN_CONFIG } from "../config/constants.js";
import { RefreshToken } from "../models/refreshToken.model.js";
import authRepository from "../repositories/auth.repository.js";
import userRepository from "../repositories/user.repository.js"
import { BadRequest, Conflict } from "../utils/errors.js";
import getGoogleUser from "../utils/google.js";
import { signJWT, verifyJWT } from "../utils/jwt.js";
import { generateOTP } from "../utils/otp.js";

const createTokens = async (userId: string) => {

    const access_token = signJWT({ userId }, { expiresIn: TOKEN_CONFIG.ACCESS_TOKEN_EXPIRES_IN });
    const refresh_token = signJWT({ userId }, { expiresIn: `${TOKEN_CONFIG.REFRESH_TOKEN_EXPIRES_IN_DAYS}d` });

    console.log("access_token:", access_token);
    console.log("refresh_token:", refresh_token);

    await RefreshToken.create({
        user: userId,
        token: refresh_token,
        expiresAt: new Date(Date.now() + TOKEN_CONFIG.REFRESH_TOKEN_EXPIRES_IN_DAYS * 24 * 60 * 60 * 1000)
    });

    console.log("Refresh token saved to DB");

    return { access_token, refresh_token };
}

const signup = async (email: string, password: string) => {

    const existing = await userRepository.getUser(email);

    if (existing) {
        throw Conflict("Email already exists");
    }

    const otp = generateOTP();
    const otpExpires = new Date(Date.now() + 5 * 60 * 1000);

    const user = await authRepository.createUser(email, password, otp, otpExpires);
    const token = signJWT({ email: user.email }, { expiresIn: "5Mins" });

    return { user, otp, token };
}

const login = async (email: string, password: string) => {

    console.log('check 1: login called with', email, password);

    const user = await userRepository.getUser(email);

    console.log('check 2: user:', user);

    if (!user) {
        throw BadRequest("User does not exist");
    }

    if (!user.password && user.googleSub) {
        throw BadRequest("This account was created using Google, please login using Google");
    }

    console.log('check 3: user found');

    const isPasswordMatch = await user.comparePassword(password);

    console.log('check 4: password match:', isPasswordMatch);

    if (!isPasswordMatch) {
        throw BadRequest("Invalid password");
    }

    console.log("User found:", user);

    if (!user.verified) {

        console.log("User is not verified, generating otp and token");

        const token = signJWT({ email: user.email }, { expiresIn: TOKEN_CONFIG.EMAIL_VERIFICATION_TOKEN_EXPIRES_IN });

        console.log("Token:", token);

        const otp = generateOTP();

        user.otp = otp;
        user.otpExpires = new Date(Date.now() + OTP_CONFIG.EXPIRES_IN_MINUTES * 60 * 1000);

        await user.save();

        console.log("User saved to DB");

        return { user, token, otp, needsVerification: true };
    }

    console.log("User is verified, generating tokens");

    const { access_token, refresh_token } = await createTokens(user?._id as string);

    return { user, access_token, refresh_token, needsVerification: false };
}

const google = async (idToken: string) => {

    const payload = await getGoogleUser(idToken);

    if (!payload || !payload.email) {
        throw BadRequest("Invalid google token");
    }

    const filter = { googleSub: payload.sub };

    const update = {
        email: payload.email,
        name: payload.name,
        picture: payload.picture,
        googleSub: payload.sub,
        verified: payload.email_verified
    };

    const user = await userRepository.googleLogin(filter, update);

    const { access_token, refresh_token } = await createTokens(user._id as string);

    return { user, access_token, refresh_token };
}

const logout = async (req: Request, res: Response) => {

}

const verifyEmail = async (token: string, otp: string) => {

    const email = verifyJWT<{ email: string }>(token)?.email;

    if (!email) {
        throw BadRequest("Invalid token");
    }

    const user = await userRepository.getUser(email);

    if (!user) {
        throw Conflict("User does not exist");
    }

    if (user.otp !== otp || !user.otpExpires || user.otpExpires < new Date()) {
        throw BadRequest("Invalid otp or otp has expired");
    }

    user.verified = true;
    user.otp = undefined;
    user.otpExpires = undefined;

    await user.save();

    const { access_token, refresh_token } = await createTokens(user._id as string);

    return { user, access_token, refresh_token };
}

const sendOtp = async (token: string) => {

    const email = verifyJWT<{ email: string }>(token)?.email;

    if (!email) {
        throw BadRequest("Invalid token");
    }

    const user = await userRepository.getUser(email);

    if (!user) {
        throw Conflict("User does not exist");
    }

    if (user.verified) {
        throw BadRequest("User is already verified");
    }

    const otp = generateOTP();
    const otpExpires = new Date(Date.now() + 5 * 60 * 1000);

    user.otp = otp;
    user.otpExpires = otpExpires;

    await user.save();

    return { otp };
};

export const validateEmailForReset = async (email: string) => {

    const user = await userRepository.getUser(email);

    if (!user) {
        throw BadRequest("User does not exist");
    };

    const token = signJWT({ email: user.email }, { expiresIn: TOKEN_CONFIG.PASSWORD_RESET_TOKEN_EXPIRES_IN });

    const otp = generateOTP();
    const otpExpires = new Date(Date.now() + OTP_CONFIG.EXPIRES_IN_MINUTES * 60 * 1000);

    user.otp = otp;
    user.otpExpires = otpExpires;

    await user.save();

    return { user, token, otp };
};

const validateOtp = async (token: string, otp: string) => {

    const email = verifyJWT<{ email: string }>(token)?.email;

    if (!email) {
        throw BadRequest("Invalid token");
    }

    const user = await userRepository.getUser(email);

    if (!user) {
        throw Conflict("User does not exist");
    }

    if (user.otp !== otp || !user.otpExpires || user.otpExpires < new Date()) {
        throw BadRequest("Invalid otp or otp has expired");
    }

    user.otp = undefined;
    user.otpExpires = undefined;

    await user.save();

}

const resetPassword = async (token: string, password: string) => {

    const email = verifyJWT<{ email: string }>(token)?.email;

    if (!email) {
        throw BadRequest("Invalid token");
    }

    const user = await userRepository.getUser(email);

    if (!user) {
        throw Conflict("User does not exist");
    }

    user.password = password;
    user.otp = undefined;
    user.otpExpires = undefined;

    await user.save();
}


const authService = {
    signup,
    login,
    google,
    logout,
    verifyEmail,
    validateEmailForReset,
    validateOtp,
    sendOtp,
    resetPassword
};

export default authService