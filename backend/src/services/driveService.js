import fs from "fs";
import { drive } from "../config/google.js";

const PASTA_RAIZ_ID = process.env.DRIVE_FOLDER_ID;

export async function uploadDrive(file) {
    const response = await drive.files.create({
        requestBody: {
            name: file.originalname,
            parents: [PASTA_RAIZ_ID],
        },
        media: {
            mimeType: file.mimetype,
            body: fs.createReadStream(file.path)
        }
    });

    fs.unlinkSync(file.path);

    return response.data;
}