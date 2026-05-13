import { RefreshToken } from "../models/refreshToken.model.js";
import { User } from "../models/user.model.js"

const createUser = async (email: string, password: string, tempName: string, tempUserName: string, otp: string, otpExpires: Date) => {
    return await User.create({
        email,
        password,
        name: tempName,
        username: tempUserName,
        verified: false,
        otp,
        otpExpires
    });
};

const logout = async (userId: string) => {
    return await RefreshToken.deleteOne({ user: userId });
}
const authRepository = {
    createUser,
    logout
};

export default authRepository;