import { google } from "googleapis";

function criarOAuth2Client(accessToken) {
    const auth = new google.auth.OAuth2();

    auth.setCredentials({
        access_token: accessToken
    });

    return auth;
}

export async function ObterInfosUsuario(accessToken) {
    const auth = criarOAuth2Client(accessToken);
    const oauth2 = google.oauth2({
        version: "v2",
        auth
    });

    const userInfo = await oauth2.userinfo.get();
    return userInfo.data;
}

export function criarDriveClient(accessToken) {
    const auth = criarOAuth2Client(accessToken);

    return google.drive({
        version: "v3",
        auth
    });
}
