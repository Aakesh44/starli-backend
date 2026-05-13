import { Schema } from "mongoose";

export interface IMedia {
    url: string;
    publicId: string;
    type: "IMAGE" | "VIDEO";
}

const mediaSchema = new Schema({
    url: {
        type: String,
        required: true
    },
    publicId: {
        type: String,
        required: true
    },
    type: {
        type: String,
        enum: ['IMAGE', 'VIDEO'],
        required: true
    }
}, {
    _id: false
});

export default mediaSchema;