import { google } from "googleapis";

export async function ObterInfosUsuario(accessToken) {
    const oauth2 = google.oauth2({
        version: "v2",
        auth: accessToken
    });

    const userInfo = await oauth2.userinfo.get();
    return userInfo.data;
}

export function criarDriveClient(accessToken) {
    const auth = new google.auth.OAuth2();

    auth.setCredentials({
        access_token: accessToken
    });

    return google.drive({
        version: "v3",
        auth
    });
}