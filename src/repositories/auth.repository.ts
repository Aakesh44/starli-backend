import { User } from "../models/user.model.js"

const createUser = async (email: string, password: string, tempUserName: string, otp: string, otpExpires: Date) => {
    return await User.create({
        email,
        password,
        username: tempUserName,
        verified: false,
        otp,
        otpExpires
    });
}

const authRepository = {
    createUser
};

export default authRepository;