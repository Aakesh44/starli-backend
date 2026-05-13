import cloudinary from "../config/cloudinary.js";
import streamifier from "streamifier";

const uploadCloudinary = async (
    file: Express.Multer.File,
    targetType: 'POST' | 'COMMENT' | 'PROFILE_PICTURE' | 'COVER_PICTURE'
) => {
    return new Promise<any>((resolve, reject) => {

        const stream = cloudinary.uploader.upload_stream(
            {
                folder: `${targetType?.toLowerCase()}s`,
                resource_type: "auto",
            },
            (error, result) => {
                if (error) {
                    reject(error);
                } else {
                    resolve(result);
                }
            }
        );

        streamifier.createReadStream(file.buffer).pipe(stream);
    });
};

const deleteCloudinary = async (publicId: string) => {
    return await cloudinary.uploader.destroy(publicId);
};

const uploadService = {
    uploadCloudinary,
    deleteCloudinary
}

export default uploadService