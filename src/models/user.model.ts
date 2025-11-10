import mongoose, { Schema, Document } from "mongoose";
import bcrypt from "bcrypt";

export interface IUser extends Document {
    email: string,
    name?: string,
    picture?: string,
    googleSub?: string,
    password: string,
    verified: boolean,
    otp?: string | undefined,
    otpExpires?: Date | undefined,
    comparePassword: (password: string) => Promise<boolean>
};

const userSchema = new Schema<IUser>({
    email: {
        type: String,
        required: true,
        unique: true
    },
    name: {
        type: String
    },
    picture: {
        type: String
    },
    googleSub: {
        type: String,
        unique: true,
        sparse: true,
        index: true,
    },
    password: {
        type: String,
        required: true,
    },
    verified: {
        type: Boolean,
        default: false
    },
    otp: {
        type: String
    },
    otpExpires: {
        type: Date
    }
});

userSchema.pre("save", async function (next) {
    if (!this.isModified("password")) return next();

    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
})

userSchema.methods.comparePassword = async function (password: string): Promise<boolean> {
    console.log('Comparing password:', password, 'with hash:', this.password);
    return await bcrypt.compare(password, this.password);
}

export const User = mongoose.model<IUser>("User", userSchema);