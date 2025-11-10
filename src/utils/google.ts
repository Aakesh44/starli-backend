import { OAuth2Client } from "google-auth-library";

const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

const getGoogleUser = async (idToken: string) => {

    const ticket = await client.verifyIdToken({
        idToken: idToken,
        audience: process.env.GOOGLE_CLIENT_ID!
    });

    const payload = ticket.getPayload();

    return payload;
}

export default getGoogleUser