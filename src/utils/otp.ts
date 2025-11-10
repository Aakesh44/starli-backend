import { OTP_CONFIG } from "../config/constants.js";

export const generateOTP = (length: number = OTP_CONFIG.LENGTH): string => {

    let otp = "";

    for(let i = 0; i < length; i++){
        otp += Math.floor(Math.random() * 10).toString();
    }

    return otp;
}