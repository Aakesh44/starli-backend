import mongoose, { Schema, Document } from "mongoose";
import bcrypt from "bcrypt";

export interface IUser extends Document {
    _id: string,
    email: string,
    name?: string,
    username?: string,
    role: "USER" | "ADMIN",
    picture?: string,
    cover_picture?: string,
    bio?: string,
    personal_website?: string,
    location?: string,
    profile_tags?: string[],
    social_links?: Record<string, string>,
    googleSub?: string,
    password: string,
    verified: boolean,
    otp?: string | undefined,
    otpExpires?: Date | undefined,
    comparePassword: (password: string) => Promise<boolean>,
    createdAt: Date,
    updatedAt: Date
};

const userSchema = new Schema<IUser>({
    email: {
        type: String,
        required: true,
        unique: true
    },
    name: {
        type: String,
        // required: true,
        minLength: 3,
        maxLength: 100
    },
    username: {
        type: String,
        required: true,
        unique: true,
        index: true
    },
    role: {
        type: String,
        enum: ['USER', 'ADMIN'],
        default: 'USER'
    },
    picture: {
        type: String,
        default: null
    },
    cover_picture: {
        type: String,
        default: null
    },
    bio: {
        type: String,
        default: null
    },
    personal_website: {
        type: String,
        default: null
    },
    location: {
        type: String,
        default: null
    },
    profile_tags: {
        type: [String],
        default: null
    },
    social_links: {
        type: Object,
        default: null
    },
    googleSub: {
        type: String,
        unique: true,
        sparse: true,
        index: true,
    },
    password: {
        type: String,
        default: null
        // select: false
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
}, { timestamps: true });

userSchema.pre("save", async function (next) {

    if (!this.password) return next();
    if (!this.isModified("password")) return next();

    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
})

userSchema.methods.comparePassword = async function (password: string): Promise<boolean> {
    console.log('Comparing password:', password, 'user:', this, 'with hash:', this.password);
    return await bcrypt.compare(password, this.password);
}

export const User = mongoose.model<IUser>("User", userSchema);