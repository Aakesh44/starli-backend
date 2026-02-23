import type { IUser } from "../../../models/user.model.js";

export const mapUserResponse = (user: IUser) => (user ? {
    id: user._id.toString(),
    username: user.username,
    email: user.email,
    name: user.name,
    picture: user.picture,
    cover_picture: user.cover_picture,
    bio: user.bio,
    personal_website: user.personal_website,
    location: user.location,
    profile_tags: user.profile_tags,
    social_links: user.social_links,
    createdAt: user.createdAt,
    updatedAt: user.updatedAt
} : null);