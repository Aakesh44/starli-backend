import { model, Schema } from "mongoose";

const refreshTokenSchema = new Schema({
    user: {
        type: Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
    token: {
        type: String,
        required: true,
    },
    expiresAt: {
        type: Date,
        required: true,
    }
});

export const RefreshToken = model("RefreshToken", refreshTokenSchema);